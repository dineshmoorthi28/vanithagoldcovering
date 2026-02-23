import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function WhatsAppButton() {
  const phoneNumber = '9080509976';
  const message = 'Hi Vanitha Covering, I would like to enquire about your jewellery collections.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-colors"
    >
      <MessageCircle size={32} />
      <span className="absolute right-full mr-4 bg-white text-stone-900 px-3 py-1 rounded-lg text-sm font-bold shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
        Chat with us
      </span>
    </motion.a>
  );
}
