import { useState, useEffect } from 'react';
import { QrCode, ArrowLeft, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import QRCodeLib from 'qrcode';

interface PaymentScreenProps {
  onBack: () => void;
}

export const PaymentScreen = ({ onBack }: PaymentScreenProps) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [paymentAmount] = useState(50000); // Rp 50,000
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed'>('pending');

  // Generate QR Code
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        // In real implementation, this would be a payment URL or payment data
        const paymentData = {
          amount: paymentAmount,
          currency: 'IDR',
          merchantId: 'PHOTOBOOTH_001',
          transactionId: `TXN_${Date.now()}`,
          description: 'Photobooth Session Payment'
        };
        
        const qrDataUrl = await QRCodeLib.toDataURL(JSON.stringify(paymentData), {
          width: 300,
          margin: 2,
          color: {
            dark: '#8B1538', // Maroon color
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, [paymentAmount]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === 'pending') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, paymentStatus]);

  // Simulate payment processing (in real app, this would be handled by payment gateway)
  const simulatePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('completed');
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="relative h-screen w-full bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <Button
          onClick={onBack}
          variant="ghost"
          size="lg"
          className="text-foreground hover:bg-secondary/20"
        >
          <ArrowLeft className="h-6 w-6 mr-2" />
          Kembali
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 pb-20">
        <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-2 border-maroon/30 shadow-2xl">
          <div className="p-8 text-center space-y-6">
            {/* Payment status indicator */}
            <div className="flex items-center justify-center mb-4">
              {paymentStatus === 'pending' && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>Menunggu Pembayaran</span>
                </div>
              )}
              {paymentStatus === 'processing' && (
                <div className="flex items-center space-x-2 text-accent">
                  <CreditCard className="h-5 w-5 animate-pulse" />
                  <span>Memproses Pembayaran...</span>
                </div>
              )}
              {paymentStatus === 'completed' && (
                <div className="flex items-center space-x-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                  <span>Pembayaran Berhasil!</span>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Scan QR Code
              </h2>
              <p className="text-muted-foreground">
                Untuk melakukan pembayaran
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-2xl shadow-inner">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Payment QR Code" 
                  className="w-full h-auto max-w-xs mx-auto"
                />
              ) : (
                <div className="w-64 h-64 bg-muted animate-pulse rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Payment details */}
            <div className="space-y-4 bg-secondary/20 p-4 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Jumlah:</span>
                <span className="text-2xl font-bold text-accent">
                  {formatCurrency(paymentAmount)}
                </span>
              </div>
              
              {paymentStatus === 'pending' && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Waktu tersisa:</span>
                  <span className="text-xl font-mono text-foreground">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {paymentStatus === 'pending' && (
              <div className="space-y-3">
                <Button
                  onClick={simulatePayment}
                  className="w-full bg-gradient-maroon hover:bg-maroon-light text-lg py-3"
                >
                  Simulasi Pembayaran
                </Button>
                <p className="text-sm text-muted-foreground">
                  Gunakan aplikasi e-wallet atau mobile banking untuk scan QR
                </p>
              </div>
            )}

            {paymentStatus === 'completed' && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                onClick={() => alert('Redirecting to photoshoot...')}
              >
                Mulai Photoshoot
              </Button>
            )}
          </div>
        </Card>

        {/* Payment instructions */}
        <div className="mt-8 max-w-md text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Instruksi Pembayaran:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Buka aplikasi e-wallet atau mobile banking</li>
            <li>• Pilih menu scan QR Code</li>
            <li>• Arahkan kamera ke QR Code di atas</li>
            <li>• Konfirmasikan pembayaran</li>
          </ul>
        </div>
      </div>
    </div>
  );
};