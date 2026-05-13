import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Copy, Check, Sparkles, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/lib/i18n';

const SUPPORT_EMAIL = 'support@snapgain.uk';

function ContactPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_EMAIL);
      setCopied(true);
      toast({
        title: t('contact.emailToast'),
        description: t('contact.emailToastDesc', { email: SUPPORT_EMAIL }),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: t('contact.couldntCopy'),
        description: t('contact.couldntCopyDesc'),
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact — SnapGain</title>
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-20 max-w-3xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3 mb-10"
        >
          <div className="w-14 h-14 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-md">
            <MessageCircle className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t('contact.title')}
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        {/* Email card */}
        <Card className="card-hover">
          <CardContent className="p-6 md:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('contact.emailUs')}
                </p>
                <p className="text-lg md:text-xl font-bold gradient-text break-all">
                  {SUPPORT_EMAIL}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild size="lg" className="flex-1">
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=SnapGain%20Support`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {t('contact.openMail')}
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={copyEmail}
                className="flex-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t('contact.copied')}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    {t('contact.copyAddress')}
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Clock className="w-3.5 h-3.5" />
              {t('contact.replyTime')}
            </div>
          </CardContent>
        </Card>

        {/* What to include */}
        <Card className="mt-5">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t('contact.whatToInclude')}
            </h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {['include1', 'include2', 'include3', 'include4'].map((k) => (
                <li key={k} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {t(`contact.${k}`)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ContactPage;
