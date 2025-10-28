"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface ConfigItem {
  id: string
  key: string
  value: string | null
  image_url: string | null
  description: string | null
}

export default function ConfigurationPage() {
  const [config, setConfig] = useState<ConfigItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check admin session
    const adminSession = localStorage.getItem("adminSession")
    if (!adminSession) {
      router.push("/admin/login")
      return
    }

    fetchConfiguration()
  }, [router])

  const fetchConfiguration = async () => {
    try {
      const response = await fetch("/api/admin/configuration")
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error("Error fetching configuration:", error)
      setError("Failed to load configuration")
    } finally {
      setLoading(false)
    }
  }

  const updateConfigItem = (key: string, field: string, value: string | null) => {
    setConfig((prev) => prev.map((item) => (item.key === key ? { ...item, [field]: value } : item)))
  }

  const saveConfiguration = async () => {
    setSaving(true)
    setError("")
    setSuccessMessage("")

    console.log("[v0] Saving configuration...", config)

    try {
      const promises = config.map((item) => {
        console.log(`[v0] Updating ${item.key}:`, {
          value: item.value,
          image_url: item.image_url,
          description: item.description,
        })
        return fetch(`/api/admin/configuration/${item.key}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            value: item.value,
            image_url: item.image_url,
            description: item.description,
          }),
        })
      })

      const results = await Promise.all(promises)
      const failed = results.filter((r) => !r.ok)

      if (failed.length > 0) {
        console.error("[v0] Failed to save some items:", failed)
        const errorDetails = await Promise.all(failed.map((r) => r.text()))
        console.error("[v0] Error details:", errorDetails)
        setError(`Failed to save ${failed.length} item(s). Check console for details.`)
      } else {
        console.log("[v0] All configuration items saved successfully")
        setSuccessMessage("All changes saved successfully!")
        setTimeout(() => setSuccessMessage(""), 3000)
      }
    } catch (err) {
      console.error("[v0] Error saving configuration:", err)
      setError("Failed to save configuration. Check console for details.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>

          <Button
            onClick={saveConfiguration}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-amber-800">Café Configuration</CardTitle>
            <p className="text-amber-600">Manage your café settings and images</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {config.map((item) => (
              <div key={item.key} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold capitalize">{item.key.replace(/_/g, " ")}</h3>
                  <span className="text-sm text-gray-500">{item.key}</span>
                </div>

                {item.description && <p className="text-sm text-gray-600">{item.description}</p>}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`${item.key}-value`}>Value</Label>
                    {item.key.includes("description") ? (
                      <Textarea
                        id={`${item.key}-value`}
                        value={item.value || ""}
                        onChange={(e) => updateConfigItem(item.key, "value", e.target.value)}
                        placeholder="Enter value..."
                        rows={3}
                      />
                    ) : (
                      <Input
                        id={`${item.key}-value`}
                        value={item.value || ""}
                        onChange={(e) => updateConfigItem(item.key, "value", e.target.value)}
                        placeholder="Enter value..."
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <ImageUpload
                      label="Image"
                      currentImageUrl={item.image_url || ""}
                      onImageChange={(url) => updateConfigItem(item.key, "image_url", url)}
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            ))}

            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
