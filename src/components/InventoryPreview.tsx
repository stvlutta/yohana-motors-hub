import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Calendar } from "lucide-react";

const sampleCars = [
  {
    id: 1,
    name: "Toyota Land Cruiser V8",
    year: 2022,
    price: "KSh 12,500,000",
    mileage: "45,000 km",
    fuel: "Diesel",
    image: "https://images.unsplash.com/photo-1594502184342-2e12f877aa73?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Mercedes-Benz C200",
    year: 2023,
    price: "KSh 6,800,000",
    mileage: "18,000 km",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Mazda CX-5",
    year: 2021,
    price: "KSh 4,200,000",
    mileage: "32,000 km",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Nissan X-Trail",
    year: 2022,
    price: "KSh 3,900,000",
    mileage: "28,000 km",
    fuel: "Petrol",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop",
  },
];

const InventoryPreview = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2">
            Featured Vehicles
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Our Inventory
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleCars.map((car) => (
            <div
              key={car.id}
              className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border group"
            >
              <div className="bg-muted flex items-center justify-center h-48">
                <span className="text-primary font-heading font-bold text-lg">{car.price}</span>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-foreground mb-3">{car.name}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.year}</span>
                  <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{car.mileage}</span>
                  <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.fuel}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/inventory">
            <Button variant="navy" size="lg" className="px-10">View All Inventory</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InventoryPreview;
