import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PolizaSegurosPage() {
  const handleDownload = () => {
    // Mock PDF download — in production this would fetch from storage
    const link = document.createElement('a');
    link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    link.download = 'poliza-seguro-ccc.pdf';
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full min-h-[70vh] rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/90 to-primary/30">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Póliza de seguro
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Descarga el documento completo de tu póliza de seguro corporativa
          </p>

          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="h-24 w-20 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <FileDown className="h-10 w-10 text-white" />
            </div>
            <span className="text-sm text-white/60">poliza-seguro-ccc.pdf</span>
            <Button
              onClick={handleDownload}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
            >
              <FileDown className="h-5 w-5" /> Descargar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
