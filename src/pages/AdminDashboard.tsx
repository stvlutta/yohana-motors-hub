import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, Car, LogOut, RefreshCw } from "lucide-react";
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [submissions, setSubmissions] = useState<SellSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [apptRes, sellRes] = await Promise.all([
      supabase.from("appointments").select("*").order("created_at", { ascending: false }),
      supabase.from("sell_submissions").select("*").order("created_at", { ascending: false }),
    ]);
    if (apptRes.data) setAppointments(apptRes.data);
    if (sellRes.data) setSubmissions(sellRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
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
        </div>

        <Tabs defaultValue="appointments">
          <TabsList>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="submissions">Sell Submissions</TabsTrigger>
          </TabsList>

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
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                            {a.status}
                          </span>
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
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                            {s.status}
                          </span>
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
    </div>
  );
};

export default AdminDashboard;
