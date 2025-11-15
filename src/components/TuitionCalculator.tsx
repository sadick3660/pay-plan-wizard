import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Printer, BookOpen, Moon, Sun, Languages } from "lucide-react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import iaasoLogo from "@/assets/iaaso-logo.png";
import presidentPhoto from "@/assets/president-photo.jpg";

const translations = {
  en: {
    title: "IAASO - DAR",
    subtitle: "Tuition Fee Payment Calculator",
    annualFee: "Annual Tuition Fee (TZS)",
    annualFeePlaceholder: "Enter total annual tuition fee",
    loanAmount: "HESLB Loan Amount (TZS)",
    loanPlaceholder: "Enter loan amount",
    calculate: "Calculate Payment Plan",
    totalPayable: "Total Payable After Loan",
    beforeReg: "Before Registration",
    afterSem1: "Before end of semester 1 exams",
    beforeSem2: "At the bgining of second semester",
    downloadPDF: "Download PDF",
    print: "Print",
    otherSystems: "View Other Academic Programs",
    createdBy: "Created by",
    president: "IAASO - PRESIDENT DSM 2025/2026",
    paymentSchedule: "Payment Schedule:",
    pdfTitle: "Tuition Fee Payment Plan",
    generatedOn: "Generated on:",
    comingSoon: "Coming Soon",
    comingSoonDesc: "Additional systems will be available here soon.",
    pdfDownloaded: "PDF Downloaded",
    pdfDownloadedDesc: "Your payment plan has been saved successfully.",
  },
  sw: {
    title: "IAASO - DAR",
    subtitle: "Kikokotoo cha Malipo ya Ada",
    annualFee: "Ada ya Mwaka (TZS)",
    annualFeePlaceholder: "Weka jumla ya ada ya mwaka",
    loanAmount: "Kiasi cha Mkopo wa HESLB (TZS)",
    loanPlaceholder: "Weka kiasi cha mkopo",
    calculate: "Kokotoa Mpango wa Malipo",
    totalPayable: "Jumla ya Kulipwa Baada ya Mkopo",
    beforeReg: "Kabla ya Usajili",
    afterSem1: "Kabla ya kuisha mitihani ya muhula 1",
    beforeSem2: "Mwanzoni mwa muhula wa pili",
    downloadPDF: "Pakua PDF",
    print: "Chapa",
    otherSystems: "Tazama Programu Zingine za Kitaaluma",
    createdBy: "Imeundwa na",
    president: "RAIS WA IAASO - DSM 2025/2026",
    paymentSchedule: "Ratiba ya Malipo:",
    pdfTitle: "Mpango wa Malipo ya Ada",
    generatedOn: "Imetengenezwa tarehe:",
    comingSoon: "Inakuja Hivi Karibuni",
    comingSoonDesc: "Mifumo mingine itapatikana hapa hivi karibuni.",
    pdfDownloaded: "PDF Imepakuwa",
    pdfDownloadedDesc: "Mpango wako wa malipo umehifadhiwa kikamilifu.",
  },
};

export default function TuitionCalculator() {
  const [annualFee, setAnnualFee] = useState("");
  const [loan, setLoan] = useState("");
  const [language, setLanguage] = useState<"en" | "sw">("en");
  const [results, setResults] = useState<{
    beforeReg: number;
    afterSem1: number;
    beforeSem2: number;
    remainingFee: number;
  } | null>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const t = translations[language];

  const calculate = () => {
    const fee = parseFloat(annualFee) || 0;
    const loanAmt = parseFloat(loan) || 0;
    const remainingFee = Math.max(fee - loanAmt, 0);

    const beforeReg = +(remainingFee * 0.4).toFixed(2);
    const afterSem1 = +(remainingFee * 0.2).toFixed(2);
    const beforeSem2 = +(remainingFee * 0.4).toFixed(2);

    setResults({ beforeReg, afterSem1, beforeSem2, remainingFee });
  };

  const downloadPDF = () => {
    if (!results) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(t.title, 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(t.pdfTitle, 105, 30, { align: "center" });
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(t.annualFee + ":", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${Number(annualFee).toLocaleString()} TZS`, 120, 50);
    
    doc.setFont("helvetica", "bold");
    doc.text(t.loanAmount + ":", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${Number(loan).toLocaleString()} TZS`, 120, 60);
    
    doc.setLineWidth(0.3);
    doc.line(20, 65, 190, 65);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(t.totalPayable + ":", 20, 75);
    doc.text(`${Number(results.remainingFee).toLocaleString()} TZS`, 120, 75);
    
    // Payment breakdown
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(t.paymentSchedule, 20, 90);
    
    doc.setFont("helvetica", "normal");
    doc.text(`40% ${t.beforeReg}:`, 20, 100);
    doc.text(`${Number(results.beforeReg).toLocaleString()} TZS`, 120, 100);
    
    doc.text(`20% ${t.afterSem1}:`, 20, 110);
    doc.text(`${Number(results.afterSem1).toLocaleString()} TZS`, 120, 110);
    
    doc.text(`40% ${t.beforeSem2}:`, 20, 120);
    doc.text(`${Number(results.beforeSem2).toLocaleString()} TZS`, 120, 120);
    
    // Footer
    doc.setLineWidth(0.3);
    doc.line(20, 270, 190, 270);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text(`${t.createdBy} Salim Sadick Mnemo - ${t.president}`, 105, 280, { align: "center" });
    doc.text(`${t.generatedOn} ${new Date().toLocaleDateString()}`, 105, 285, { align: "center" });
    
    doc.save("IAASO-Payment-Plan.pdf");
    
    toast({
      title: t.pdfDownloaded,
      description: t.pdfDownloadedDesc,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const navigateToPrograms = () => {
    navigate("/programs");
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "sw" : "en"));
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="shadow-2xl border-none rounded-2xl bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-end gap-2 mb-4">
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className="h-9 w-9"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={toggleLanguage}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Languages className="h-4 w-4" />
                {language === "en" ? "SW" : "EN"}
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <motion.img
                src={iaasoLogo}
                alt="IAASO DAR Logo"
                className="w-24 h-24 drop-shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
              />
              <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
                {t.title}
              </h1>
              <p className="text-lg md:text-xl text-center text-muted-foreground font-medium">
                {t.subtitle}
              </p>
            </div>

            <div className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label htmlFor="annualFee" className="text-foreground font-semibold text-base">
                  {t.annualFee}
                </Label>
                <Input
                  id="annualFee"
                  type="number"
                  placeholder={t.annualFeePlaceholder}
                  value={annualFee}
                  onChange={(e) => setAnnualFee(e.target.value)}
                  className="h-12 text-base border-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loan" className="text-foreground font-semibold text-base">
                  {t.loanAmount}
                </Label>
                <Input
                  id="loan"
                  type="number"
                  placeholder={t.loanPlaceholder}
                  value={loan}
                  onChange={(e) => setLoan(e.target.value)}
                  className="h-12 text-base border-2 focus-visible:ring-primary"
                />
              </div>

              <Button
                onClick={calculate}
                className="w-full h-12 bg-primary hover:bg-accent text-primary-foreground font-semibold text-base rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t.calculate}
              </Button>
            </div>

            {results && (
              <motion.div
                className="mt-6 bg-primary-light rounded-xl shadow-inner p-6 space-y-4 border-2 border-primary/20"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center pb-3 border-b-2 border-primary/30">
                  <p className="font-bold text-xl text-foreground">
                    {t.totalPayable}
                  </p>
                  <p className="text-3xl font-extrabold text-primary mt-2">
                    {Number(results.remainingFee).toLocaleString()} TZS
                  </p>
                </div>
                
                <div className="space-y-3 text-foreground">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💰</span>
                      <span className="font-semibold">40% {t.beforeReg}</span>
                    </div>
                    <span className="font-bold text-primary">
                      {Number(results.beforeReg).toLocaleString()} TZS
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">📚</span>
                      <span className="font-semibold">20% {t.afterSem1}</span>
                    </div>
                    <span className="font-bold text-primary">
                      {Number(results.afterSem1).toLocaleString()} TZS
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎓</span>
                      <span className="font-semibold">40% {t.beforeSem2}</span>
                    </div>
                    <span className="font-bold text-primary">
                      {Number(results.beforeSem2).toLocaleString()} TZS
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={downloadPDF}
                    variant="default"
                    className="flex-1 h-11"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t.downloadPDF}
                  </Button>
                </div>

                <div className="border-t-2 border-primary/30 pt-4 mt-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <p className="text-sm text-muted-foreground">
                      {t.createdBy} <span className="font-bold text-accent">Salim Sadick Mnemo</span>
                      <br />
                      <span className="font-semibold">{t.president}</span>
                    </p>
                    <img 
                      src={presidentPhoto} 
                      alt="Salim Sadick Mnemo"
                      className="w-14 h-14 rounded-full object-cover border-2 border-accent shadow-lg"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-6">
              <Button
                onClick={navigateToPrograms}
                variant="secondary"
                className="w-full h-12"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                {t.otherSystems}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}