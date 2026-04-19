import { motion } from 'framer-motion';

interface Props {
  categories: { name: string; count: number }[];
  active: string;
  onChange: (cat: string) => void;
  totalCount: number;
}

export default function CategoryFilterBar({ categories, active, onChange, totalCount }: Props) {
  const all = [{ name: 'All', count: totalCount }, ...categories];
  return (
    <div className="-mx-4 sm:mx-0 overflow-x-auto scrollbar-thin pb-2">
      <div className="flex gap-2 px-4 sm:px-0 min-w-max">
        {all.map((c) => {
          const isActive = active === c.name;
          return (
            <motion.button
              key={c.name}
              onClick={() => onChange(c.name)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${
                isActive
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : 'bg-card text-foreground border-border hover:border-primary/40 hover:text-primary'
              }`}
            >
              {c.name}
              <span className={`text-xs rounded-full px-2 py-0.5 ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {c.count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
