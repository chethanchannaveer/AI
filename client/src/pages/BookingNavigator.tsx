import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import BookingSiteCard from "@/components/BookingSiteCard";
import { Search, Sparkles, DollarSign, Calendar, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BookingNavigator() {
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // TODO: Remove mock data - replace with real booking site recommendations from backend
  const bookingSites = {
    packages: [
      { name: "Expedia", description: "Bundle flight + hotel to save up to 30%. Package deals with flexible cancellation", url: "https://www.expedia.com/vacation-packages", category: "Package Deals" },
      { name: "Priceline", description: "Express Deals with mystery hotels at 40% off. Best for flexible travelers", url: "https://www.priceline.com/packages", category: "Package Deals" },
      { name: "Costco Travel", description: "Members-only vacation packages with exclusive rates and perks", url: "https://www.costcotravel.com", category: "Package Deals" },
      { name: "Hotwire", description: "Hot Rate packages - save up to 60% by booking opaque deals", url: "https://www.hotwire.com/packages", category: "Package Deals" },
    ],
    flights: [
      { name: "Google Flights", description: "Price tracking, flexible date search, and price calendar. Shows Southwest Airlines", url: "https://www.google.com/flights", category: "Flights" },
      { name: "Skyscanner", description: "Compare 100M+ flights worldwide. 'Everywhere' search for budget destinations", url: "https://www.skyscanner.com", category: "Flights" },
      { name: "Kayak", description: "Price alerts, extensive filters, and hacker fares to save money", url: "https://www.kayak.com/flights", category: "Flights" },
      { name: "Momondo", description: "Transparent pricing from 700+ airlines with no hidden fees", url: "https://www.momondo.com", category: "Flights" },
    ],
    hotels: [
      { name: "Booking.com", description: "2.5M+ properties with Genius rewards - save up to 15% on stays", url: "https://www.booking.com", category: "Hotels" },
      { name: "Hotels.com", description: "Rewards program - collect 10 nights, get 1 free. Price match guarantee", url: "https://www.hotels.com", category: "Hotels" },
      { name: "Airbnb", description: "Unique homes and apartments. Better value for groups and longer stays", url: "https://www.airbnb.com", category: "Accommodations" },
      { name: "Hostelworld", description: "Budget-friendly hostels, shared rooms, and social accommodations", url: "https://www.hostelworld.com", category: "Budget Hotels" },
    ],
    restaurants: [
      { name: "OpenTable", description: "Reserve tables at 60,000+ restaurants worldwide with instant confirmation", url: "https://www.opentable.com", category: "Dining" },
      { name: "Resy", description: "Discover and book the best restaurants. Exclusive reservations", url: "https://www.resy.com", category: "Dining" },
      { name: "Yelp", description: "Find local restaurants with reviews, ratings, and photos", url: "https://www.yelp.com", category: "Dining" },
    ],
    events: [
      { name: "Eventbrite", description: "Discover local events, concerts, festivals, and conferences", url: "https://www.eventbrite.com", category: "Events" },
      { name: "Ticketmaster", description: "Official tickets for concerts, sports, theater, and comedy shows", url: "https://www.ticketmaster.com", category: "Events" },
      { name: "StubHub", description: "Buy and sell tickets to sports, concerts, and live events", url: "https://www.stubhub.com", category: "Event Tickets" },
    ],
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // TODO: Replace with actual intent detection from backend AI agent
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      const hasBudget = budget.trim().length > 0;
      const hasMultipleNeeds = (lowerQuery.includes("flight") || lowerQuery.includes("fly")) && 
                               (lowerQuery.includes("hotel") || lowerQuery.includes("stay"));
      
      // If budget is provided or query mentions package/trip/vacation, show packages
      if (hasBudget || hasMultipleNeeds || lowerQuery.includes("package") || 
          lowerQuery.includes("trip") || lowerQuery.includes("vacation")) {
        setDetectedIntent("packages");
      } else if (lowerQuery.includes("flight") || lowerQuery.includes("fly")) {
        setDetectedIntent("flights");
      } else if (lowerQuery.includes("hotel") || lowerQuery.includes("stay") || lowerQuery.includes("accommodation")) {
        setDetectedIntent("hotels");
      } else if (lowerQuery.includes("restaurant") || lowerQuery.includes("dinner") || lowerQuery.includes("eat")) {
        setDetectedIntent("restaurants");
      } else if (lowerQuery.includes("event") || lowerQuery.includes("concert") || lowerQuery.includes("show") || lowerQuery.includes("ticket")) {
        setDetectedIntent("events");
      } else {
        setDetectedIntent("packages");
      }
      setIsAnalyzing(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen">
      <div className="py-12 px-8 border-b">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Travel Planner</h1>
          <p className="text-muted-foreground mb-8">
            AI-powered travel planning with budget-based navigation to official booking sites
          </p>

          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="destination" className="text-sm mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Destination
                </Label>
                <Input
                  id="destination"
                  placeholder="e.g., Paris, Tokyo, New York"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  data-testid="input-destination"
                />
              </div>
              <div>
                <Label htmlFor="dates" className="text-sm mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Travel Dates
                </Label>
                <Input
                  id="dates"
                  placeholder="e.g., Next month, Dec 15-22"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  data-testid="input-dates"
                />
              </div>
              <div>
                <Label htmlFor="budget" className="text-sm mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Budget (Optional)
                </Label>
                <Input
                  id="budget"
                  type="text"
                  placeholder="e.g., $2000, €1500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  data-testid="input-budget"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="query" className="text-sm mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Travel Request
              </Label>
              <Input
                id="query"
                placeholder="Describe your trip (e.g., 'Plan a budget trip to Paris with flight and hotel')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-12 text-base"
                data-testid="input-booking-query"
              />
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={!query.trim() || isAnalyzing}
              className="w-full h-12"
              data-testid="button-analyze"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Planning Your Trip..." : "Plan My Trip"}
            </Button>

            {detectedIntent && (
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium mb-1">
                  Trip Plan Ready: <span className="text-primary capitalize">{detectedIntent === "packages" ? "Complete Package Deals" : detectedIntent}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {budget && `Budget: ${budget} • `}
                  {destination && `Destination: ${destination} • `}
                  {dates && `Dates: ${dates} • `}
                  Navigate to official booking sites below
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {detectedIntent && (
        <div className="py-8 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-2">Official Booking Sites</h2>
            <p className="text-muted-foreground mb-6">
              Click to navigate to trusted booking platforms. {budget && `Sites below are optimized for budget-conscious travelers.`}
            </p>
            
            <Tabs defaultValue={detectedIntent} className="w-full">
              <TabsList>
                <TabsTrigger value="packages">Package Deals</TabsTrigger>
                <TabsTrigger value="flights">Flights Only</TabsTrigger>
                <TabsTrigger value="hotels">Hotels Only</TabsTrigger>
                <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
                <TabsTrigger value="events">Events & Tickets</TabsTrigger>
              </TabsList>
              
              {Object.entries(bookingSites).map(([category, sites]) => (
                <TabsContent key={category} value={category} className="mt-6">
                  {category === "packages" && budget && (
                    <Card className="p-4 mb-4 bg-green-500/10 border-green-500/20">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        💡 Budget Tip: Package deals (flight + hotel) typically save 10-30% compared to booking separately. 
                        Best value for trips 3+ nights.
                      </p>
                    </Card>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sites.map((site) => (
                      <BookingSiteCard key={site.name} {...site} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      )}

      {!detectedIntent && (
        <div className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">1. Describe Your Trip</h3>
                <p className="text-sm text-muted-foreground">
                  Tell us where you want to go, when, and your budget
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">2. AI Analyzes Intent</h3>
                <p className="text-sm text-muted-foreground">
                  Our agent detects what you need and finds the best sites
                </p>
              </Card>
              <Card className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">3. Navigate to Book</h3>
                <p className="text-sm text-muted-foreground">
                  Click to go to official sites with your search parameters
                </p>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
