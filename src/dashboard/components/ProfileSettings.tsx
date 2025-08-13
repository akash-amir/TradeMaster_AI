import { useState, useEffect } from "react";
import { User, Settings, Key, Shield, Trash2, Camera, Save, Upload, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "../hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";

interface ProfileSettingsProps {
  className?: string;
}

export default function ProfileSettings({ className }: ProfileSettingsProps) {
  const { toast } = useToast();
  const { profile, loading, updateProfile } = useUserProfile();
  
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    email: ""
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || "",
        email: profile.email || ""
      });
    }
  }, [profile]);

  const handleProfileUpdate = async () => {
    try {
      await updateProfile({ full_name: profileForm.full_name });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwords.new.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwords.new 
      });

      if (error) throw error;

      toast({
        title: "Password Changed",
        description: "Your password has been successfully updated.",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      toast({
        title: "Password Update Failed",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const generateNewApiKey = () => {
    const newKey = `tm_sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    // setProfile(prev => ({ ...prev, apiKey: newKey })); // This line was removed as per the new_code
    toast({
      title: "API Key Generated",
      description: "A new API key has been generated.",
    });
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload file to Supabase Storage with user ID as filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
      // Delete existing avatar if it exists
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([fileName]);
      
      // Upload new avatar
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl });
      
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className={`space-y-6 sm:space-y-8 ${className}`}>
      <div className="animate-reveal">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Profile & Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Profile Information */}
        <Card className="glass-card animate-reveal animate-reveal-delay-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-full">
                <AvatarImage 
                  src={profile?.avatar_url || ""} 
                  alt={profile?.full_name || "User avatar"}
                />
                <AvatarFallback className="bg-primary/20 text-primary text-base sm:text-lg rounded-full">
                  {profile?.full_name?.split(' ').map(n => n[0]).join('') || profile?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
                <label htmlFor="avatar-upload">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="cursor-pointer w-full sm:w-auto"
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? (
                      <>
                        <Camera className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </>
                    )}
                  </Button>
                </label>
                {profile?.avatar_url && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateProfile({ avatar_url: null })}
                    className="text-destructive hover:text-destructive w-full sm:w-auto"
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                <Input
                  id="name"
                  value={profileForm.full_name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="bg-input border-border text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  readOnly
                  className="bg-muted border-border text-muted-foreground text-sm sm:text-base"
                  placeholder="Your email address"
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed. Contact support if you need to update it.
                </p>
              </div>

              <Button 
                onClick={handleProfileUpdate} 
                className="btn-premium w-full"
                disabled={loading}
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card animate-reveal animate-reveal-delay-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm sm:text-base">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                  className="bg-input border-border text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm sm:text-base">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                  className="bg-input border-border text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm sm:text-base">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                  className="bg-input border-border text-sm sm:text-base"
                />
              </div>

              <Button onClick={handlePasswordChange} variant="outline" className="w-full" disabled={updatingPassword}>
                {updatingPassword ? (
                  <>
                    <Lock className="h-4 w-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API & Subscription */}
        <Card className="glass-card animate-reveal animate-reveal-delay-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Key className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              API & Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Subscription Plan</Label>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <span className="font-medium text-foreground text-sm sm:text-base">Pro Plan</span>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">Manage</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm sm:text-base">API Key</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value="tm_sk_1234567890abcdef"
                    readOnly
                    className="bg-input border-border font-mono text-xs sm:text-sm"
                  />
                  <Button onClick={generateNewApiKey} variant="outline" size="sm" className="text-xs sm:text-sm">
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this key to access TradeMaster AI API
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="glass-card animate-reveal animate-reveal-delay-4 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive text-base sm:text-lg">
              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <h4 className="font-medium text-destructive mb-2 text-sm sm:text-base">Delete Account</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <Button variant="destructive" size="sm" className="text-xs sm:text-sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}