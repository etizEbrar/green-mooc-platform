import {
  AlertTriangle, ArrowRight, Award, BarChart3, BookOpen, Briefcase, Check, CheckCircle2,
  ChevronRight, Circle, ClipboardList, Clock, Compass, Download, Factory, FileText, Globe,
  GraduationCap, HardHat, Image, Lightbulb, Link2, Lock, Mail, Menu, PartyPopper,
  Presentation, Printer, Puzzle, Recycle, RotateCcw, Search, ShieldCheck, Sparkles,
  Sprout, Star, StickyNote, Target, ThumbsUp, TrendingUp, Users, Video, X, Zap
} from 'lucide-react';

// One place to map a meaning onto a glyph, so the same idea never ends up
// drawn two different ways across the app.
const ICONS = {
  // Modules
  'module-1': Sprout,
  'module-2': Briefcase,
  'module-3': Compass,
  'module-4': Zap,
  'module-5': Recycle,
  'module-6': BarChart3,
  // Unit sections and materials
  video: Video,
  notes: StickyNote,
  activity: Puzzle,
  reading: FileText,
  download: Download,
  link: Link2,
  materials: BookOpen,
  // Status
  complete: CheckCircle2,
  incomplete: Circle,
  locked: Lock,
  retry: RotateCcw,
  next: ArrowRight,
  verify: ShieldCheck,
  search: Search,
  // Feedback tone
  celebrate: PartyPopper,
  good: ThumbsUp,
  tip: Lightbulb,
  recorded: ClipboardList,
  warning: AlertTriangle,
  // Course furniture
  certificate: Award,
  progress: TrendingUp,
  target: Target,
  learners: Users,
  course: GraduationCap,
  email: Mail,
  spark: Sparkles,
  // Audiences and "how it works" steps
  factory: Factory,
  worker: HardHat,
  globe: Globe,
  compass: Compass,
  // Material types
  pdf: FileText,
  doc: FileText,
  slides: Presentation,
  image: Image,
  // Small affordances
  check: Check,
  close: X,
  menu: Menu,
  star: Star,
  printer: Printer,
  clock: Clock,
  chevron: ChevronRight,
  pending: Clock
};

export default function Icon({ name, size = 20, className = '', ...rest }) {
  const Glyph = ICONS[name];
  if (!Glyph) return null;
  return (
    <Glyph
      size={size}
      strokeWidth={1.9}
      className={`icon ${className}`.trim()}
      aria-hidden="true"
      focusable="false"
      {...rest}
    />
  );
}
