import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Field = {
  name: string;
  label: string;
  placeholder: string;
  type: 'text' | 'email' | 'textarea';
  hint: string;
};

const STEPS: { title: string; emoji: string; field: Field }[] = [
  {
    title: 'Кличка',
    emoji: '🐾',
    field: { name: 'nickname', label: 'Как твоя кличка?', placeholder: 'Барсик', type: 'text', hint: 'Только кличка, без лишнего' },
  },
  {
    title: 'Возраст',
    emoji: '🎂',
    field: { name: 'age', label: 'Сколько тебе лет?', placeholder: '18', type: 'text', hint: 'Просто число' },
  },
  {
    title: 'Юзернейм',
    emoji: '🏷️',
    field: { name: 'username', label: 'Ваш юзернейм', placeholder: '@username', type: 'text', hint: 'Ник в соцсети или мессенджере' },
  },
  {
    title: 'Хобби',
    emoji: '🎨',
    field: { name: 'hobbies', label: 'Какие у тебя хобби и увлечения?', placeholder: 'Рисование, чтение, игры...', type: 'textarea', hint: 'Расскажи, чем занимаешься в свободное время' },
  },
  {
    title: 'Как узнал',
    emoji: '🔍',
    field: { name: 'howFound', label: 'Как ты узнал о нашей стае?', placeholder: 'Через друга, в интернете...', type: 'textarea', hint: 'Расскажи свою историю знакомства с нами' },
  },
  {
    title: 'Ожидания',
    emoji: '✨',
    field: { name: 'expectations', label: 'Какие у тебя ожидания от стаи?', placeholder: 'Хочу найти друзей, развиваться...', type: 'textarea', hint: 'Что надеешься получить от нашего сообщества' },
  },
  {
    title: 'Персонажи',
    emoji: '📖',
    field: { name: 'characters', label: 'Какие 3 любимых персонажа из «Дом, в котором…»?', placeholder: 'Курильщик, Сфинкс, Македонский...', type: 'text', hint: 'Через запятую' },
  },
];

const SEND_URL = 'https://functions.poehali.dev/eeb68172-86be-4c30-a798-82f0d9260764';

const Index = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + (done ? 1 : 0)) / STEPS.length) * 100;

  const validate = () => {
    const value = (data[current.field.name] || '').trim();
    if (!value) {
      setError('Это поле нужно заполнить');
      return false;
    }
    setError('');
    return true;
  };

  const submit = async () => {
    setSending(true);
    try {
      await fetch(SEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setDone(true);
    } catch {
      setError('Ошибка отправки, попробуй ещё раз');
    } finally {
      setSending(false);
    }
  };

  const next = () => {
    if (!validate()) return;
    if (isLast) {
      submit();
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => {
    setError('');
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans">
      <div className="grain absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-multiply" />
      <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      {/* marquee header */}
      <div className="border-b-2 border-foreground/90 overflow-hidden bg-foreground text-background">
        <div className="flex whitespace-nowrap animate-marquee py-2.5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 pr-4 font-display uppercase tracking-[0.2em] text-sm">
              {Array.from({ length: 8 }).map((_, j) => (
                <span key={j} className="flex items-center gap-4">
                  Расскажите о себе <span className="text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-16 pb-24">
        {/* heading */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 border-2 border-foreground rounded-full px-4 py-1.5 mb-6 text-xs font-display uppercase tracking-[0.15em]">
            <span className="w-2 h-2 rounded-full bg-accent" /> Анкета участника
          </div>
          <h1 className="font-display uppercase font-bold leading-[0.9] text-6xl sm:text-7xl">
            Давайте <br />
            <span className="text-accent">познакомимся</span>
          </h1>
          <p className="mt-5 text-muted-foreground max-w-md text-lg">
            Четыре коротких вопроса. Займёт меньше минуты — обещаем.
          </p>
        </div>

        {/* progress */}
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-display text-sm tabular-nums text-muted-foreground">
            {done ? STEPS.length : step + 1}/{STEPS.length}
          </span>
        </div>

        {/* card */}
        {!done ? (
          <div
            key={step}
            className="animate-fade-in-up bg-card border-2 border-foreground rounded-3xl p-8 sm:p-10 shadow-[8px_8px_0_0_hsl(var(--foreground))]"
          >
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">{current.emoji}</span>
              <span className="font-display uppercase tracking-[0.15em] text-sm text-muted-foreground">
                Шаг {step + 1} · {current.title}
              </span>
            </div>

            <Label htmlFor={current.field.name} className="block font-display uppercase text-2xl sm:text-3xl mb-2 leading-tight">
              {current.field.label}
            </Label>
            <p className="text-muted-foreground mb-6">{current.field.hint}</p>

            {current.field.type === 'textarea' ? (
              <Textarea
                id={current.field.name}
                value={data[current.field.name] || ''}
                placeholder={current.field.placeholder}
                onChange={(e) => setData({ ...data, [current.field.name]: e.target.value })}
                className="min-h-32 text-lg bg-background border-2 border-foreground/30 focus-visible:border-accent focus-visible:ring-accent rounded-xl resize-none"
              />
            ) : (
              <Input
                id={current.field.name}
                type={current.field.type}
                value={data[current.field.name] || ''}
                placeholder={current.field.placeholder}
                onChange={(e) => setData({ ...data, [current.field.name]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && next()}
                className="h-14 text-lg bg-background border-2 border-foreground/30 focus-visible:border-accent focus-visible:ring-accent rounded-xl"
              />
            )}

            {error && (
              <p className="mt-3 flex items-center gap-2 text-destructive font-medium animate-fade-in-up">
                <Icon name="CircleAlert" size={18} /> {error}
              </p>
            )}

            <div className="flex items-center justify-between mt-10">
              <Button
                variant="ghost"
                onClick={back}
                disabled={step === 0}
                className="font-display uppercase tracking-wide disabled:opacity-0"
              >
                <Icon name="ArrowLeft" size={18} className="mr-1" /> Назад
              </Button>
              <Button
                onClick={next}
                disabled={sending}
                className="h-13 px-8 py-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-display uppercase tracking-wide text-base shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all disabled:opacity-70"
              >
                {sending ? 'Отправляем...' : isLast ? 'Отправить' : 'Далее'}
                <Icon name={sending ? 'Loader' : isLast ? 'Send' : 'ArrowRight'} size={18} className={`ml-2 ${sending ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="animate-scale-in bg-foreground text-background rounded-3xl p-10 sm:p-14 text-center shadow-[8px_8px_0_0_hsl(var(--accent))]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent text-accent-foreground mb-6">
              <Icon name="Check" size={40} />
            </div>
            <h2 className="font-display uppercase text-4xl sm:text-5xl mb-4 leading-tight">
              Готово!
            </h2>
            <p className="text-background/70 text-lg max-w-sm mx-auto mb-8">
              Спасибо, {data.nickname || 'друг'}! Мы получили вашу анкету.
            </p>
            <Button
              onClick={() => {
                setData({});
                setStep(0);
                setDone(false);
              }}
              variant="outline"
              className="rounded-full border-2 border-background bg-transparent text-background hover:bg-background hover:text-foreground font-display uppercase tracking-wide"
            >
              <Icon name="RotateCcw" size={18} className="mr-2" /> Заполнить заново
            </Button>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8 font-display uppercase tracking-[0.15em]">
          Ваши данные в безопасности 🔒
        </p>
      </main>
    </div>
  );
};

export default Index;