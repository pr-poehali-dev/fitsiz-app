import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
        };
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        openTelegramLink: (url: string) => void;
      };
    };
  }
}

type Screen = 'home' | 'setup' | 'history' | 'info';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [userName, setUserName] = useState('Гость');
  const [isTelegram, setIsTelegram] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (!tg) {
      setIsTelegram(false);
      return;
    }

    tg.ready();
    tg.expand();
    tg.setHeaderColor('#121212');
    tg.setBackgroundColor('#121212');

    const user = tg.initDataUnsafe?.user;
    if (user) {
      setUserName(user.first_name + (user.last_name ? ' ' + user.last_name : ''));
    }

    tg.BackButton.onClick(() => {
      handleHaptic('light');
      setCurrentScreen('home');
    });
  }, []);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      if (currentScreen === 'home') {
        tg.BackButton.hide();
      } else {
        tg.BackButton.show();
      }
    }
  }, [currentScreen]);

  const handleHaptic = (style: 'light' | 'medium' | 'heavy' = 'medium') => {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);
  };

  const openBot = (botUsername: string) => {
    handleHaptic('medium');
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.openTelegramLink(`https://t.me/${botUsername}`);
    }
  };

  const navigateTo = (screen: Screen) => {
    handleHaptic('light');
    setCurrentScreen(screen);
  };

  if (!isTelegram) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-32 h-32 mx-auto bg-primary rounded-3xl flex items-center justify-center">
            <span className="text-6xl font-bold text-white">F</span>
          </div>
          <h1 className="text-3xl font-bold">FITSIZ</h1>
          <p className="text-muted-foreground text-lg">
            Пожалуйста, откройте приложение в Telegram
          </p>
          <div className="w-48 h-48 mx-auto bg-white rounded-2xl p-4">
            <div className="text-xs text-black">QR-код здесь</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {currentScreen === 'home' && (
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">FITSIZ</h1>
                <p className="text-sm text-muted-foreground">{userName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card
              onClick={() => navigateTo('setup')}
              className="bg-primary hover:bg-primary/90 border-0 p-8 cursor-pointer hover-scale"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Icon name="Settings" size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">НАСТРОИТЬ МАСКУ</h2>
                  <p className="text-white/80 text-sm">Видеоинструкции для всех моделей</p>
                </div>
                <Icon name="ChevronRight" size={24} className="text-white" />
              </div>
            </Card>

            <Card
              onClick={() => openBot('fitsiz_assistant_bot')}
              className="bg-card hover:bg-card/80 border-border p-6 cursor-pointer hover-scale"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
                  <Icon name="Bot" size={24} className="text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">ИИ ПОМОЩНИК</h3>
                  <p className="text-muted-foreground text-sm">Консультация и помощь</p>
                </div>
                <Icon name="ExternalLink" size={20} className="text-muted-foreground" />
              </div>
            </Card>

            <Card
              onClick={() => openBot('fitsiz_support_bot')}
              className="bg-card hover:bg-card/80 border-border p-6 cursor-pointer hover-scale"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
                  <Icon name="Headphones" size={24} className="text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">ПОДДЕРЖКА 24/7</h3>
                  <p className="text-muted-foreground text-sm">Связь с техподдержкой</p>
                </div>
                <Icon name="ExternalLink" size={20} className="text-muted-foreground" />
              </div>
            </Card>
          </div>
        </div>
      )}

      {currentScreen === 'setup' && (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">Видеоинструкции</h1>
          <p className="text-muted-foreground">Выберите модель маски для просмотра инструкции</p>
          
          <div className="space-y-4">
            {[
              { name: 'ELEMENT STATIC', id: '456239193' },
              { name: 'EXPAN HD ULTRA', id: '456239191' },
              { name: 'ELEMENT HD COLOR', id: '456239190' },
              { name: 'ELEMENT CLASSIC', id: '456239189' },
              { name: 'ELEMENT ARGON', id: '456239188' },
            ].map((model, idx) => (
              <Card key={idx} className="bg-card border-border p-6 hover-scale cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{model.name}</h3>
                  <Icon name="Play" size={24} className="text-primary" />
                </div>
                <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                  <Icon name="Video" size={48} className="text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentScreen === 'history' && (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">История запросов</h1>
          
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <Icon name="MessageSquare" size={40} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-center">
              У вас еще нет запросов к ассистенту
            </p>
            <Button onClick={() => openBot('fitsiz_assistant_bot')} className="bg-primary hover:bg-primary/90">
              Начать диалог
            </Button>
          </div>
        </div>
      )}

      {currentScreen === 'info' && (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">О приложении</h1>
          
          <Card className="bg-card border-border p-6 space-y-4">
            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto">
              <span className="text-4xl font-bold text-white">F</span>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">FITSIZ</h2>
              <p className="text-muted-foreground mb-4">Премиальные сварочные маски</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Версия 1.0.0</p>
                <p>© 2024 FITSIZ. Все права защищены.</p>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <h3 className="text-xl font-bold mb-4">Возможности</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle2" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Видеоинструкции</p>
                  <p className="text-sm text-muted-foreground">Настройка всех моделей масок</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle2" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">ИИ-ассистент</p>
                  <p className="text-sm text-muted-foreground">Консультация по любым вопросам</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle2" size={20} className="text-primary mt-0.5" />
                <div>
                  <p className="font-semibold">Техподдержка 24/7</p>
                  <p className="text-sm text-muted-foreground">Помощь в любое время</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around p-4">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'home' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="Home" size={24} />
            <span className="text-xs font-medium">Главная</span>
          </button>
          
          <button
            onClick={() => navigateTo('history')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'history' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="History" size={24} />
            <span className="text-xs font-medium">История</span>
          </button>
          
          <button
            onClick={() => navigateTo('info')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === 'info' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name="Info" size={24} />
            <span className="text-xs font-medium">Информация</span>
          </button>
        </div>
      </div>
    </div>
  );
}
