import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarCheck, Car, LogOut, RefreshCw, Plus, Pencil, Trash2, Package } from "lucide-react";
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
  status: string; created_at: string;
};

type Vehicle = {
  id: string; name: string; make: string; model: string; year: number;
  price: string; mileage: string | null; fuel: string | null;
  transmission: string | null; body_type: string | null;
  description: string | null; is_available: boolean; created_at: string;
};

const emptyVehicle = {
  name: "", make: "", model: "", year: "", price: "",
  mileage: "", fuel: "", transmission: "", body_type: "", description: "",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [submissions, setSubmissions] = useState<SellSubmission[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Vehicle form state
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleForm, setVehicleForm] = useState(emptyVehicle);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [apptRes, sellRes, vehRes] = await Promise.all([
      supabase.from("appointments").select("*").order("created_at", { ascending: false }),
      supabase.from("sell_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
    ]);
    if (apptRes.data) setAppointments(apptRes.data);
    if (sellRes.data) setSubmissions(sellRes.data);
    if (vehRes.data) setVehicles(vehRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const openAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm(emptyVehicle);
    setVehicleDialogOpen(true);
  };

  const openEditVehicle = (v: Vehicle) => {
    setEditingVehicle(v);
    setVehicleForm({
      name: v.name, make: v.make, model: v.model, year: String(v.year),
      price: v.price, mileage: v.mileage || "", fuel: v.fuel || "",
      transmission: v.transmission || "", body_type: v.body_type || "",
      description: v.description || "",
    });
    setVehicleDialogOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: vehicleForm.name,
      make: vehicleForm.make,
      model: vehicleForm.model,
      year: parseInt(vehicleForm.year),
      price: vehicleForm.price,
      mileage: vehicleForm.mileage || null,
      fuel: vehicleForm.fuel || null,
      transmission: vehicleForm.transmission || null,
      body_type: vehicleForm.body_type || null,
      description: vehicleForm.description || null,
    };

    let error;
    if (editingVehicle) {
      ({ error } = await supabase.from("vehicles").update(payload).eq("id", editingVehicle.id));
    } else {
      ({ error } = await supabase.from("vehicles").insert(payload));
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

  const toggleAvailability = async (v: Vehicle) => {
    const { error } = await supabase.from("vehicles").update({ is_available: !v.is_available }).eq("id", v.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: v.is_available ? "Marked as sold" : "Marked as available" });
      fetchData();
    }
  };

  const deleteVehicle = async (id: string) => {
    if (!confirm("Delete this vehicle permanently?")) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Vehicle deleted" });
      fetchData();
    }
  };

  const updateStatus = async (table: "appointments" | "sell_submissions", id: string, status: string) => {
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Status updated to "${status}"` });
      fetchData();
    }
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
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg gradient-navy flex items-center justify-center">
              <CalendarCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{appointments.length}</p>
              <p className="text-sm text-muted-foreground">Appointments</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg gradient-red flex items-center justify-center">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{submissions.length}</p>
              <p className="text-sm text-muted-foreground">Sell Submissions</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{vehicles.length}</p>
              <p className="text-sm text-muted-foreground">Vehicles</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="vehicles">
          <TabsList>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="submissions">Sell Submissions</TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">{vehicles.filter(v => v.is_available).length} available, {vehicles.filter(v => !v.is_available).length} sold</p>
              <Button variant="hero" size="sm" onClick={openAddVehicle}>
                <Plus className="h-4 w-4 mr-1" /> Add Vehicle
              </Button>
            </div>
            {vehicles.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No vehicles yet. Add your first listing!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="p-3 font-semibold text-muted-foreground">Vehicle</th>
                      <th className="p-3 font-semibold text-muted-foreground">Year</th>
                      <th className="p-3 font-semibold text-muted-foreground">Price</th>
                      <th className="p-3 font-semibold text-muted-foreground">Fuel</th>
                      <th className="p-3 font-semibold text-muted-foreground">Trans.</th>
                      <th className="p-3 font-semibold text-muted-foreground">Status</th>
                      <th className="p-3 font-semibold text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((v) => (
                      <tr key={v.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 text-foreground font-medium">{v.make} {v.model}</td>
                        <td className="p-3 text-foreground">{v.year}</td>
                        <td className="p-3 text-foreground">{v.price}</td>
                        <td className="p-3 text-foreground">{v.fuel || "—"}</td>
                        <td className="p-3 text-foreground">{v.transmission || "—"}</td>
                        <td className="p-3">
                          <button onClick={() => toggleAvailability(v)} className="cursor-pointer">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${v.is_available ? "bg-green-500/10 text-green-600" : "bg-muted text-muted-foreground"}`}>
                              {v.is_available ? "Available" : "Sold"}
                            </span>
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditVehicle(v)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteVehicle(v.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="mt-4">
            {appointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No appointments yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="p-3 font-semibold text-muted-foreground">Name</th>
                      <th className="p-3 font-semibold text-muted-foreground">Phone</th>
                      <th className="p-3 font-semibold text-muted-foreground">Service</th>
                      <th className="p-3 font-semibold text-muted-foreground">Date</th>
                      <th className="p-3 font-semibold text-muted-foreground">Time</th>
                      <th className="p-3 font-semibold text-muted-foreground">Status</th>
                      <th className="p-3 font-semibold text-muted-foreground">Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((a) => (
                      <tr key={a.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 text-foreground font-medium">{a.name}</td>
                        <td className="p-3 text-foreground">{a.phone}</td>
                        <td className="p-3 text-foreground">{a.service}</td>
                        <td className="p-3 text-foreground">{a.appointment_date}</td>
                        <td className="p-3 text-foreground">{a.appointment_time}</td>
                        <td className="p-3">
                          <select
                            value={a.status}
                            onChange={(e) => updateStatus("appointments", a.id, e.target.value)}
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold border-none outline-none cursor-pointer ${statusColor(a.status)}`}
                          >
                            <option value="pending">pending</option>
                            <option value="confirmed">confirmed</option>
                            <option value="completed">completed</option>
                            <option value="cancelled">cancelled</option>
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

          {/* Sell Submissions Tab */}
          <TabsContent value="submissions" className="mt-4">
            {submissions.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No submissions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="p-3 font-semibold text-muted-foreground">Name</th>
                      <th className="p-3 font-semibold text-muted-foreground">Phone</th>
                      <th className="p-3 font-semibold text-muted-foreground">Vehicle</th>
                      <th className="p-3 font-semibold text-muted-foreground">Year</th>
                      <th className="p-3 font-semibold text-muted-foreground">Price</th>
                      <th className="p-3 font-semibold text-muted-foreground">Condition</th>
                      <th className="p-3 font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr key={s.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3 text-foreground font-medium">{s.name}</td>
                        <td className="p-3 text-foreground">{s.phone}</td>
                        <td className="p-3 text-foreground">{s.make} {s.model}</td>
                        <td className="p-3 text-foreground">{s.year}</td>
                        <td className="p-3 text-foreground">{s.asking_price}</td>
                        <td className="p-3 text-foreground">{s.condition}</td>
                        <td className="p-3">
                          <select
                            value={s.status}
                            onChange={(e) => updateStatus("sell_submissions", s.id, e.target.value)}
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold border-none outline-none cursor-pointer ${statusColor(s.status)}`}
                          >
                            <option value="pending">pending</option>
                            <option value="confirmed">confirmed</option>
                            <option value="completed">completed</option>
                            <option value="cancelled">cancelled</option>
                          </select>
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
            <DialogTitle className="font-heading">{editingVehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveVehicle} className="space-y-4">
            <Input placeholder="Display Name (e.g. 2024 Toyota Land Cruiser)" value={vehicleForm.name} onChange={(e) => vf("name", e.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Make" value={vehicleForm.make} onChange={(e) => vf("make", e.target.value)} required />
              <Input placeholder="Model" value={vehicleForm.model} onChange={(e) => vf("model", e.target.value)} required />
              <Input placeholder="Year" type="number" value={vehicleForm.year} onChange={(e) => vf("year", e.target.value)} required />
              <Input placeholder="Price (e.g. KSh 5,500,000)" value={vehicleForm.price} onChange={(e) => vf("price", e.target.value)} required />
              <Input placeholder="Mileage" value={vehicleForm.mileage} onChange={(e) => vf("mileage", e.target.value)} />
              <Input placeholder="Fuel (Petrol/Diesel/Hybrid)" value={vehicleForm.fuel} onChange={(e) => vf("fuel", e.target.value)} />
              <Input placeholder="Transmission (Auto/Manual)" value={vehicleForm.transmission} onChange={(e) => vf("transmission", e.target.value)} />
              <Input placeholder="Body Type (SUV/Sedan/Truck)" value={vehicleForm.body_type} onChange={(e) => vf("body_type", e.target.value)} />
            </div>
            <Textarea placeholder="Description (optional)" value={vehicleForm.description} onChange={(e) => vf("description", e.target.value)} />
            <Button type="submit" variant="hero" className="w-full" disabled={saving}>
              {saving ? "Saving..." : editingVehicle ? "Update Vehicle" : "Add Vehicle"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
