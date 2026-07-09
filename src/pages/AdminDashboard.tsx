import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarCheck, Car, LogOut, RefreshCw, Plus, Pencil, Trash2, Package, Upload, X, Globe, Eye, Film } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

type Appointment = {
  id: string; name: string; phone: string; email: string;
  service: string; appointment_date: string; appointment_time: string;
  message: string | null; status: string; created_at: string;
};

type SellSubmission = {
  id: string; name: string; phone: string; email: string;
  make: string; model: string; year: string; mileage: string;
  asking_price: string; condition: string; description: string | null;
  status: string; created_at: string; photo_urls: string[] | null;
};

type Vehicle = {
  id: string; name: string; make: string; model: string; year: number;
  price: string; mileage: string | null; fuel: string | null;
  transmission: string | null; body_type: string | null; engine_cc: number | null;
  description: string | null; image_url: string | null; image_urls: string[] | null; is_available: boolean; created_at: string;
};

type OverseasVehicle = Vehicle & { source_country: string | null; source_url: string | null };

type VlogVideo = {
  id: string; title: string; url: string; platform: string;
  thumbnail_url: string | null; description: string | null; created_at: string;
};

const emptyVehicle = {
  name: "", make: "", model: "", year: "", price: "",
  mileage: "", fuel: "", transmission: "", body_type: "", engine_cc: "", description: "",
  source_country: "", source_url: "",
};

const emptyVideo = { title: "", url: "", platform: "youtube", thumbnail_url: "", description: "" };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [submissions, setSubmissions] = useState<SellSubmission[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [overseas, setOverseas] = useState<OverseasVehicle[]>([]);
  const [videos, setVideos] = useState<VlogVideo[]>([]);
  const [loading, setLoading] = useState(true);

  // Vlog form state
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VlogVideo | null>(null);
  const [videoForm, setVideoForm] = useState(emptyVideo);
  const [savingVideo, setSavingVideo] = useState(false);

  // Vehicle form state
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | OverseasVehicle | null>(null);
  const [editingTable, setEditingTable] = useState<"vehicles" | "overseas_vehicles">("vehicles");
  const [vehicleForm, setVehicleForm] = useState(emptyVehicle);
  const [saving, setSaving] = useState(false);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Submission detail dialog
  const [viewingSubmission, setViewingSubmission] = useState<SellSubmission | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [apptRes, sellRes, vehRes, ovRes, vidRes] = await Promise.all([
      supabase.from("appointments").select("*").order("created_at", { ascending: false }),
      supabase.from("sell_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
      supabase.from("overseas_vehicles").select("*").order("created_at", { ascending: false }),
      supabase.from("vlog_videos" as never).select("*").order("created_at", { ascending: false }),
    ]);
    if (apptRes.data) setAppointments(apptRes.data);
    if (sellRes.data) setSubmissions(sellRes.data as SellSubmission[]);
    if (vehRes.data) setVehicles(vehRes.data);
    if (ovRes.data) setOverseas(ovRes.data as OverseasVehicle[]);
    if (vidRes.data) setVideos(vidRes.data as VlogVideo[]);
    setLoading(false);
  };

  const openAddVideo = () => {
    setEditingVideo(null);
    setVideoForm(emptyVideo);
    setVideoDialogOpen(true);
  };

  const openEditVideo = (v: VlogVideo) => {
    setEditingVideo(v);
    setVideoForm({
      title: v.title, url: v.url, platform: v.platform,
      thumbnail_url: v.thumbnail_url || "", description: v.description || "",
    });
    setVideoDialogOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVideo(true);
    const payload = {
      title: videoForm.title,
      url: videoForm.url,
      platform: videoForm.platform,
      thumbnail_url: videoForm.thumbnail_url || null,
      description: videoForm.description || null,
    };
    const { error } = editingVideo
      ? await supabase.from("vlog_videos" as never).update(payload as never).eq("id", editingVideo.id)
      : await supabase.from("vlog_videos" as never).insert(payload as never);
    setSavingVideo(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: editingVideo ? "Video updated" : "Video added" }); setVideoDialogOpen(false); fetchData(); }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    const { error } = await supabase.from("vlog_videos" as never).delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Video deleted" }); fetchData(); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const openAddVehicle = (table: "vehicles" | "overseas_vehicles") => {
    setEditingTable(table);
    setEditingVehicle(null);
    setVehicleForm(emptyVehicle);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setExistingImageUrls([]);
    setVehicleDialogOpen(true);
  };

  const openEditVehicle = (v: Vehicle | OverseasVehicle, table: "vehicles" | "overseas_vehicles") => {
    setEditingTable(table);
    setEditingVehicle(v);
    setVehicleForm({
      name: v.name, make: v.make, model: v.model, year: String(v.year),
      price: v.price, mileage: v.mileage || "", fuel: v.fuel || "",
      transmission: v.transmission || "", body_type: v.body_type || "",
      engine_cc: v.engine_cc ? String(v.engine_cc) : "",
      description: v.description || "",
      source_country: (v as OverseasVehicle).source_country || "",
      source_url: (v as OverseasVehicle).source_url || "",
    });
    setNewImageFiles([]);
    setNewImagePreviews([]);
    const existing = [...(v.image_urls || [])];
    if (v.image_url && !existing.includes(v.image_url)) existing.unshift(v.image_url);
    setExistingImageUrls(existing);
    setVehicleDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setNewImageFiles((prev) => [...prev, ...files]);
    setNewImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeExistingImage = (url: string) => {
    setExistingImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const removeNewImage = (idx: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const uploadedUrls: string[] = [];
    for (const file of newImageFiles) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("vehicle-images")
        .upload(path, file);
      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("vehicle-images").getPublicUrl(path);
      uploadedUrls.push(urlData.publicUrl);
    }

    const allImages = [...existingImageUrls, ...uploadedUrls];

    const payload: Record<string, unknown> = {
      name: vehicleForm.name,
      make: vehicleForm.make,
      model: vehicleForm.model,
      year: parseInt(vehicleForm.year),
      price: vehicleForm.price,
      mileage: vehicleForm.mileage || null,
      fuel: vehicleForm.fuel || null,
      transmission: vehicleForm.transmission || null,
      body_type: vehicleForm.body_type || null,
      engine_cc: vehicleForm.engine_cc ? parseInt(vehicleForm.engine_cc) : null,
      description: vehicleForm.description || null,
      image_url: allImages[0] || null,
      image_urls: allImages,
    };
    if (editingTable === "overseas_vehicles") {
      payload.source_country = vehicleForm.source_country || null;
      payload.source_url = vehicleForm.source_url || null;
    }

    let error;
    if (editingVehicle) {
      ({ error } = await supabase.from(editingTable).update(payload as never).eq("id", editingVehicle.id));
    } else {
      ({ error } = await supabase.from(editingTable).insert(payload as never));
    }

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingVehicle ? "Vehicle updated" : "Vehicle added" });
      setVehicleDialogOpen(false);
      fetchData();
    }
  };

  const toggleAvailability = async (v: Vehicle | OverseasVehicle, table: "vehicles" | "overseas_vehicles") => {
    const { error } = await supabase.from(table).update({ is_available: !v.is_available }).eq("id", v.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: v.is_available ? "Marked as sold" : "Marked as available" }); fetchData(); }
  };

  const deleteVehicle = async (id: string, table: "vehicles" | "overseas_vehicles") => {
    if (!confirm("Delete this vehicle permanently?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Vehicle deleted" }); fetchData(); }
  };

  const updateStatus = async (table: "appointments" | "sell_submissions", id: string, status: string) => {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Status updated to "${status}"` }); fetchData(); }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "confirmed": return "bg-blue-500/10 text-blue-600";
      case "completed": return "bg-green-500/10 text-green-600";
      case "cancelled": return "bg-destructive/10 text-destructive";
      default: return "bg-primary/10 text-primary";
    }
  };

  const vf = (field: string, value: string) => setVehicleForm({ ...vehicleForm, [field]: value });

  const renderVehicleTable = (list: (Vehicle | OverseasVehicle)[], table: "vehicles" | "overseas_vehicles") => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="p-3 font-semibold text-muted-foreground">Photo</th>
            <th className="p-3 font-semibold text-muted-foreground">Vehicle</th>
            <th className="p-3 font-semibold text-muted-foreground">Year</th>
            <th className="p-3 font-semibold text-muted-foreground">Price</th>
            {table === "overseas_vehicles" && <th className="p-3 font-semibold text-muted-foreground">From</th>}
            <th className="p-3 font-semibold text-muted-foreground">Status</th>
            <th className="p-3 font-semibold text-muted-foreground text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((v) => (
            <tr key={v.id} className="border-b border-border hover:bg-muted/50">
              <td className="p-3">
                {v.image_url ? (
                  <img src={v.image_url} alt="" className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center"><Car className="h-5 w-5 text-muted-foreground/40" /></div>
                )}
              </td>
              <td className="p-3 text-foreground font-medium">{v.make} {v.model}</td>
              <td className="p-3 text-foreground">{v.year}</td>
              <td className="p-3 text-foreground">{v.price}</td>
              {table === "overseas_vehicles" && <td className="p-3 text-foreground">{(v as OverseasVehicle).source_country || "—"}</td>}
              <td className="p-3">
                <button onClick={() => toggleAvailability(v, table)} className="cursor-pointer">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${v.is_available ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                    {v.is_available ? "Available" : "Sold"}
                  </span>
                </button>
              </td>
              <td className="p-3 text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditVehicle(v, table)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteVehicle(v.id, table)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Yohana" className="h-10" />
          <h1 className="font-heading font-bold text-foreground text-lg">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg gradient-navy flex items-center justify-center"><CalendarCheck className="h-6 w-6 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{appointments.length}</p><p className="text-sm text-muted-foreground">Appointments</p></div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg gradient-red flex items-center justify-center"><Car className="h-6 w-6 text-primary-foreground" /></div>
            <div><p className="text-2xl font-bold text-foreground">{submissions.length}</p><p className="text-sm text-muted-foreground">Sell Submissions</p></div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Package className="h-6 w-6 text-primary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{vehicles.length}</p><p className="text-sm text-muted-foreground">Inventory</p></div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center"><Globe className="h-6 w-6 text-secondary" /></div>
            <div><p className="text-2xl font-bold text-foreground">{overseas.length}</p><p className="text-sm text-muted-foreground">Overseas Stock</p></div>
          </div>
        </div>

        <Tabs defaultValue="vehicles">
          <TabsList>
            <TabsTrigger value="vehicles">Inventory</TabsTrigger>
            <TabsTrigger value="overseas">Overseas Stock</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="submissions">Sell Submissions</TabsTrigger>
            <TabsTrigger value="vlog">VLOG</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{vehicles.filter(v => v.is_available).length} available, {vehicles.filter(v => !v.is_available).length} sold</p>
              <Button variant="hero" size="sm" onClick={() => openAddVehicle("vehicles")}><Plus className="h-4 w-4 mr-1" /> Add Vehicle</Button>
            </div>
            {vehicles.length === 0 ? <p className="text-muted-foreground text-center py-12">No vehicles yet.</p> : renderVehicleTable(vehicles, "vehicles")}
          </TabsContent>

          <TabsContent value="overseas" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{overseas.filter(v => v.is_available).length} available overseas</p>
              <Button variant="hero" size="sm" onClick={() => openAddVehicle("overseas_vehicles")}><Plus className="h-4 w-4 mr-1" /> Add Overseas Vehicle</Button>
            </div>
            {overseas.length === 0 ? <p className="text-muted-foreground text-center py-12">No overseas vehicles yet.</p> : renderVehicleTable(overseas, "overseas_vehicles")}
          </TabsContent>

          <TabsContent value="appointments" className="mt-4">
            {appointments.length === 0 ? <p className="text-muted-foreground text-center py-12">No appointments yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-left">
                    <th className="p-3 font-semibold text-muted-foreground">Name</th>
                    <th className="p-3 font-semibold text-muted-foreground">Phone</th>
                    <th className="p-3 font-semibold text-muted-foreground">Service</th>
                    <th className="p-3 font-semibold text-muted-foreground">Date</th>
                    <th className="p-3 font-semibold text-muted-foreground">Time</th>
                    <th className="p-3 font-semibold text-muted-foreground">Status</th>
                    <th className="p-3 font-semibold text-muted-foreground">Message</th>
                  </tr></thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 text-foreground font-medium">{a.name}</td>
                        <td className="p-3 text-foreground">{a.phone}</td>
                        <td className="p-3 text-foreground">{a.service}</td>
                        <td className="p-3 text-foreground">{a.appointment_date}</td>
                        <td className="p-3 text-foreground">{a.appointment_time}</td>
                        <td className="p-3">
                          <select value={a.status} onChange={(e) => updateStatus("appointments", a.id, e.target.value)}
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold border-none outline-none cursor-pointer ${statusColor(a.status)}`}>
                            <option value="pending">pending</option><option value="confirmed">confirmed</option>
                            <option value="completed">completed</option><option value="cancelled">cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-muted-foreground max-w-[200px] truncate">{a.message || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions" className="mt-4">
            {submissions.length === 0 ? <p className="text-muted-foreground text-center py-12">No submissions yet.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-left">
                    <th className="p-3 font-semibold text-muted-foreground">Photos</th>
                    <th className="p-3 font-semibold text-muted-foreground">Customer</th>
                    <th className="p-3 font-semibold text-muted-foreground">Phone</th>
                    <th className="p-3 font-semibold text-muted-foreground">Vehicle</th>
                    <th className="p-3 font-semibold text-muted-foreground">Year</th>
                    <th className="p-3 font-semibold text-muted-foreground">Mileage</th>
                    <th className="p-3 font-semibold text-muted-foreground">Asking</th>
                    <th className="p-3 font-semibold text-muted-foreground">Status</th>
                    <th className="p-3 font-semibold text-muted-foreground text-right">View</th>
                  </tr></thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr key={s.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">
                          {s.photo_urls && s.photo_urls.length > 0 ? (
                            <div className="flex -space-x-2">
                              {s.photo_urls.slice(0, 3).map((url) => (
                                <img key={url} src={url} alt="" className="w-10 h-10 rounded-full border-2 border-card object-cover" />
                              ))}
                              {s.photo_urls.length > 3 && (
                                <span className="w-10 h-10 rounded-full border-2 border-card bg-muted text-xs flex items-center justify-center font-semibold text-muted-foreground">+{s.photo_urls.length - 3}</span>
                              )}
                            </div>
                          ) : <span className="text-muted-foreground text-xs">No photos</span>}
                        </td>
                        <td className="p-3 text-foreground font-medium">{s.name}</td>
                        <td className="p-3 text-foreground">{s.phone}</td>
                        <td className="p-3 text-foreground">{s.make} {s.model}</td>
                        <td className="p-3 text-foreground">{s.year}</td>
                        <td className="p-3 text-foreground">{s.mileage}</td>
                        <td className="p-3 text-foreground">{s.asking_price}</td>
                        <td className="p-3">
                          <select value={s.status} onChange={(e) => updateStatus("sell_submissions", s.id, e.target.value)}
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold border-none outline-none cursor-pointer ${statusColor(s.status)}`}>
                            <option value="pending">pending</option><option value="confirmed">confirmed</option>
                            <option value="completed">completed</option><option value="cancelled">cancelled</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => setViewingSubmission(s)}><Eye className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="vlog" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{videos.length} video{videos.length !== 1 ? "s" : ""} published</p>
              <Button variant="hero" size="sm" onClick={openAddVideo}><Plus className="h-4 w-4 mr-1" /> Add Video Link</Button>
            </div>
            {videos.length === 0 ? <p className="text-muted-foreground text-center py-12">No videos yet. Add links to Instagram reels, YouTube videos, or TikTok clips.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border text-left">
                    <th className="p-3 font-semibold text-muted-foreground">Title</th>
                    <th className="p-3 font-semibold text-muted-foreground">Platform</th>
                    <th className="p-3 font-semibold text-muted-foreground">URL</th>
                    <th className="p-3 font-semibold text-muted-foreground text-right">Actions</th>
                  </tr></thead>
                  <tbody>
                    {videos.map((v) => (
                      <tr key={v.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 text-foreground font-medium">{v.title}</td>
                        <td className="p-3 text-foreground capitalize">{v.platform}</td>
                        <td className="p-3"><a href={v.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs truncate max-w-xs inline-block">{v.url}</a></td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditVideo(v)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteVideo(v.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Vehicle Add/Edit Dialog */}
      <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingVehicle ? "Edit" : "Add"} {editingTable === "overseas_vehicles" ? "Overseas Vehicle" : "Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveVehicle} className="space-y-4">
            <Input placeholder="Display Name (e.g. 2024 Toyota Land Cruiser)" value={vehicleForm.name} onChange={(e) => vf("name", e.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Make" value={vehicleForm.make} onChange={(e) => vf("make", e.target.value)} required />
              <Input placeholder="Model" value={vehicleForm.model} onChange={(e) => vf("model", e.target.value)} required />
              <Input placeholder="Year" type="number" value={vehicleForm.year} onChange={(e) => vf("year", e.target.value)} required />
              <Input placeholder="Price (e.g. KSh 5,500,000)" value={vehicleForm.price} onChange={(e) => vf("price", e.target.value)} required />
              <Input placeholder="Mileage" value={vehicleForm.mileage} onChange={(e) => vf("mileage", e.target.value)} />
              <Input placeholder="Fuel" value={vehicleForm.fuel} onChange={(e) => vf("fuel", e.target.value)} />
              <Input placeholder="Transmission" value={vehicleForm.transmission} onChange={(e) => vf("transmission", e.target.value)} />
              <Input placeholder="Body Type" value={vehicleForm.body_type} onChange={(e) => vf("body_type", e.target.value)} />
              <Input placeholder="Engine (CC, e.g. 2500)" type="number" value={vehicleForm.engine_cc} onChange={(e) => vf("engine_cc", e.target.value)} />
            </div>
            {editingTable === "overseas_vehicles" && (
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Source Country (e.g. Japan)" value={vehicleForm.source_country} onChange={(e) => vf("source_country", e.target.value)} />
                <Input placeholder="Source URL (optional)" value={vehicleForm.source_url} onChange={(e) => vf("source_url", e.target.value)} />
              </div>
            )}
            <Textarea placeholder="Description (optional)" value={vehicleForm.description} onChange={(e) => vf("description", e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Vehicle Photos (you can add multiple)</label>
              {(existingImageUrls.length > 0 || newImagePreviews.length > 0) && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {existingImageUrls.map((url) => (
                    <div key={url} className="relative h-24 rounded-md overflow-hidden border border-border">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-background">
                        <X className="h-3 w-3 text-foreground" />
                      </button>
                    </div>
                  ))}
                  {newImagePreviews.map((src, i) => (
                    <div key={src} className="relative h-24 rounded-md overflow-hidden border border-primary/40">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-background">
                        <X className="h-3 w-3 text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-md cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                <span className="text-sm text-muted-foreground">Click to add photo(s) — select multiple at once or repeat</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
              <p className="text-xs text-muted-foreground mt-1">First photo is the cover. Hold Ctrl/Cmd or Shift in the file picker to choose several at once.</p>
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={saving}>
              {saving ? "Saving..." : editingVehicle ? "Update Vehicle" : "Add Vehicle"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Submission Detail Dialog */}
      <Dialog open={!!viewingSubmission} onOpenChange={(o) => !o && setViewingSubmission(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-heading">Sell Submission Details</DialogTitle></DialogHeader>
          {viewingSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground text-xs">Customer</p><p className="font-medium">{viewingSubmission.name}</p></div>
                <div><p className="text-muted-foreground text-xs">Phone</p><p className="font-medium">{viewingSubmission.phone}</p></div>
                <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium">{viewingSubmission.email}</p></div>
                <div><p className="text-muted-foreground text-xs">Condition</p><p className="font-medium">{viewingSubmission.condition}</p></div>
                <div><p className="text-muted-foreground text-xs">Vehicle</p><p className="font-medium">{viewingSubmission.make} {viewingSubmission.model} ({viewingSubmission.year})</p></div>
                <div><p className="text-muted-foreground text-xs">Mileage</p><p className="font-medium">{viewingSubmission.mileage}</p></div>
                <div><p className="text-muted-foreground text-xs">Asking Price</p><p className="font-medium">{viewingSubmission.asking_price}</p></div>
                <div><p className="text-muted-foreground text-xs">Status</p><p className="font-medium capitalize">{viewingSubmission.status}</p></div>
              </div>
              {viewingSubmission.description && (
                <div><p className="text-muted-foreground text-xs mb-1">Description</p><p className="text-sm whitespace-pre-line">{viewingSubmission.description}</p></div>
              )}
              <div>
                <p className="text-muted-foreground text-xs mb-2">Photos ({viewingSubmission.photo_urls?.length || 0})</p>
                {viewingSubmission.photo_urls && viewingSubmission.photo_urls.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {viewingSubmission.photo_urls.map((url) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-md overflow-hidden border border-border">
                        <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </a>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No photos uploaded by the customer.</p>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
