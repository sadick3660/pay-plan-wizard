import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const programs = [
  {
    id: 1,
    name: "GAP - GPA Calculator",
    description: "A simple and efficient GPA calculator for students to track their academic performance.",
    duration: "Web Application",
    link: "https://mrdino-tz.github.io/GAP/"
  },
  {
    id: 2,
    name: "ISMS Portal",
    description: "Institute Student Management System for accessing academic records, schedules, and other student services.",
    duration: "Web Portal",
    link: "https://isms.iaa.ac.tz/isms-dar/web/index.php?r=site%2Flogin"
  }
];

export default function Programs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrograms = programs.filter(program => 
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProgramClick = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6 pt-6">
          <Button 
            onClick={() => navigate("/")} 
            variant="outline" 
            size="icon"
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-primary">Academic Programs</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Explore Our Programs</CardTitle>
            <CardDescription>
              Discover the wide range of academic programs offered at IAASO
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search programs..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                onClick={() => setSearchTerm("")}
                variant="outline"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{program.name}</CardTitle>
                <CardDescription>{program.duration}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
                <Button 
                  onClick={() => handleProgramClick(program.link)}
                  variant="secondary"
                  className="w-full"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No programs found matching your search.</p>
              <Button 
                onClick={() => setSearchTerm("")}
                variant="outline"
                className="mt-4"
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}