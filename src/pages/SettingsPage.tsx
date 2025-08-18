import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Save, Settings, Bell, Shield, Database, Mail } from 'lucide-react'

// Local type for admin settings (remove if you add it to '@/types')
interface AdminSettings {
  allowNewRegistrations: boolean
  maintenanceMode: boolean
  maxFreeTrialDays: number
  emailNotifications: {
    newUsers: boolean
    failedPayments: boolean
    systemAlerts: boolean
  }
  apiLimits: {
    free: number
    premium: number
    professional: number
  }
}

export default function SettingsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: adminApi.getSettings,
  })

  const [formData, setFormData] = useState<AdminSettings>({
    allowNewRegistrations: true,
    maintenanceMode: false,
    maxFreeTrialDays: 14,
    emailNotifications: {
      newUsers: true,
      failedPayments: true,
      systemAlerts: true,
    },
    apiLimits: {
      free: 100,
      premium: 1000,
      professional: 10000,
    },
  })

  // Update form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const updateSettingsMutation = useMutation({
    mutationFn: adminApi.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      toast({
        title: 'Settings updated',
        description: 'Admin settings have been successfully updated.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update settings',
        variant: 'destructive',
      })
    },
  })

  const handleSave = () => {
    updateSettingsMutation.mutate(formData)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof AdminSettings],
        [field]: value,
      },
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure admin panel and system settings</p>
        </div>
        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="w-32 h-6 bg-muted rounded animate-pulse" />
                <div className="w-48 h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="w-full h-10 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure admin panel and system settings</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={updateSettingsMutation.isPending}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {updateSettingsMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Database className="h-4 w-4" />
            API Limits
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow New Registrations</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable or disable new user sign-ups
                  </div>
                </div>
                <Switch
                  checked={formData.allowNewRegistrations}
                  onCheckedChange={(checked) => handleInputChange('allowNewRegistrations', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Maintenance Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Put the platform in maintenance mode
                  </div>
                </div>
                <Switch
                  checked={formData.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="trialDays">Free Trial Duration (days)</Label>
                <Input
                  id="trialDays"
                  type="number"
                  value={formData.maxFreeTrialDays}
                  onChange={(e) => handleInputChange('maxFreeTrialDays', parseInt(e.target.value))}
                  className="w-32"
                />
                <div className="text-sm text-muted-foreground">
                  Number of days for free trial period
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure admin email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New User Registrations</Label>
                  <div className="text-sm text-muted-foreground">
                    Get notified when new users sign up
                  </div>
                </div>
                <Switch
                  checked={formData.emailNotifications.newUsers}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('emailNotifications', 'newUsers', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Failed Payments</Label>
                  <div className="text-sm text-muted-foreground">
                    Get notified about payment failures
                  </div>
                </div>
                <Switch
                  checked={formData.emailNotifications.failedPayments}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('emailNotifications', 'failedPayments', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">System Alerts</Label>
                  <div className="text-sm text-muted-foreground">
                    Get notified about system issues
                  </div>
                </div>
                <Switch
                  checked={formData.emailNotifications.systemAlerts}
                  onCheckedChange={(checked) => 
                    handleNestedInputChange('emailNotifications', 'systemAlerts', checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Rate Limits</CardTitle>
              <CardDescription>Configure API usage limits per subscription plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="freeLimit">Free Plan Limit</Label>
                  <Input
                    id="freeLimit"
                    type="number"
                    value={formData.apiLimits.free}
                    onChange={(e) => 
                      handleNestedInputChange('apiLimits', 'free', parseInt(e.target.value))
                    }
                  />
                  <div className="text-sm text-muted-foreground">
                    Requests per month
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="premiumLimit">Premium Plan Limit</Label>
                  <Input
                    id="premiumLimit"
                    type="number"
                    value={formData.apiLimits.premium}
                    onChange={(e) => 
                      handleNestedInputChange('apiLimits', 'premium', parseInt(e.target.value))
                    }
                  />
                  <div className="text-sm text-muted-foreground">
                    Requests per month
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalLimit">Professional Plan Limit</Label>
                  <Input
                    id="professionalLimit"
                    type="number"
                    value={formData.apiLimits.professional}
                    onChange={(e) => 
                      handleNestedInputChange('apiLimits', 'professional', parseInt(e.target.value))
                    }
                  />
                  <div className="text-sm text-muted-foreground">
                    Requests per month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Admin Access</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage admin account security settings
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Change Email
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Shield className="h-4 w-4" />
                      Change Password
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Session Management</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure session timeout and security
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Auto-logout after inactivity</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        defaultValue={60}
                        className="w-32"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Audit Logging</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure audit trail and logging
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Log admin actions</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Log user access</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Log API requests</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}