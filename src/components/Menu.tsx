import { Coffee, CupSoda, Leaf, Instagram } from 'lucide-react';
import styles from './Menu.module.css';

interface MenuItem {
  name: string;
  price: string;
  star?: boolean;
}

function MenuSection({
  icon,
  title,
  dollar,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  dollar?: string;
  items: MenuItem[];
}) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionLabel}>
          <span className={styles.sectionIcon}>{icon}</span>
          <span className={styles.sectionTitle}>{title}</span>
        </div>
        {dollar && <span className={styles.sectionDollar}>{dollar}</span>}
      </div>
      <div className={styles.items}>
        {items.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.itemName}>{item.name}</span>
            <span className={styles.itemPrice}>
              {item.star && <span className={styles.starPrice}>★</span>}
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const coffeeItems: MenuItem[] = [
  { name: 'Americano', price: '20K' },
  { name: 'Long Black', price: '25K' },
  { name: 'Classic Cappuccino', price: '30K', star: true },
  { name: 'Best Latte', price: '30K' },
  { name: 'Kopi Susu Signature', price: '25K', star: true },
  { name: 'Kopi Susu Aren', price: '30K', star: true },
  { name: 'Dirty Espresso Latte', price: '35K' },
  { name: 'Caramel Macchiato', price: '38K' },
  { name: 'Mont Blanc Coffee', price: '35K' },
  { name: 'Mocha Latte', price: '38K' },
  { name: 'Tiramisu Latte', price: '38K', star: true },
  { name: 'Butterscotch Latte', price: '38K' },
  { name: 'Pistachio Latte', price: '38K' },
  { name: 'Irish Coffee', price: '38K' },
  { name: 'Ice Shaken Ristretto', price: '38K' },
  { name: 'Espresso Tonic', price: '35K', star: true },
  { name: 'Nitro Coffee', price: '38K' },
  { name: 'Soffee', price: '35K' },
  { name: 'Ekstasi (Iced Only)', price: '35K' },
  { name: 'American Peach (Iced Only)', price: '30K' },
];

const manualBrewItems: MenuItem[] = [
  { name: 'V60 / Japanese', price: '35K' },
  { name: 'Cold Brew', price: '35K' },
];

const teaItems: MenuItem[] = [
  { name: 'Apple Tea', price: '23K' },
  { name: 'Lemon Tea', price: '20K' },
  { name: 'Earl Grey Milk Tea', price: '30K', star: true },
];

const nonCoffeeItems: MenuItem[] = [
  { name: 'Choco Latte', price: '36K', star: true },
  { name: 'Matcha Latte', price: '36K', star: true },
  { name: 'Orange Juice', price: '25K' },
  { name: 'Baileys on Rock', price: '60K / 80K' },
];

const iconSize = 16;
const iconStroke = 2;

export default function Menu() {
  return (
    <div className={styles.page}>
      <div className={styles.sheet}>
        {/* HEADER */}
        <header>
          <div className={styles.brand}>
            <div className={styles.brandText}>
              <div className={styles.brandName}>BCKYRD</div>
              <div className={styles.brandSub}>SIGNATURE</div>
              <div className={styles.brandLine}>
                SPECIALITY COFFEE &nbsp;|&nbsp; DINE IN &nbsp;|&nbsp; TAKE AWAY
              </div>
            </div>
            <div className={styles.logo}>
              <img src="/coin.png" alt="BCKYRD Logo" />
            </div>
          </div>
        </header>

        <div className={styles.divider} />

        {/* MENU GRID */}
        <div className={styles.grid}>
          <div className={styles.gridLine} />

          {/* LEFT COLUMN */}
          <div className={styles.colLeft}>
            <MenuSection
              icon={<Coffee size={iconSize} strokeWidth={iconStroke} />}
              title="COFFEE"
              dollar="$"
              items={coffeeItems}
            />
            <div className={styles.from}>FROM THE LAND OF INDONESIA</div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.colRight}>
            <MenuSection
              icon={<Coffee size={iconSize} strokeWidth={iconStroke} />}
              title="MANUAL BREW"
              dollar="$"
              items={manualBrewItems}
            />
            <MenuSection
              icon={<Leaf size={iconSize} strokeWidth={iconStroke} />}
              title="TEA"
              dollar="$"
              items={teaItems}
            />
            <MenuSection
              icon={<CupSoda size={iconSize} strokeWidth={iconStroke} />}
              title="NON COFFEE"
              dollar="$"
              items={nonCoffeeItems}
            />

            {/* FLAVOUR LATTE */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <div className={styles.sectionLabel}>
                  <span className={styles.sectionIcon}>
                    <Coffee size={iconSize} strokeWidth={iconStroke} />
                  </span>
                  <span className={styles.sectionTitle}>
                    FLAVOUR LATTE –{' '}
                    <span className={styles.sectionPrice}>35K</span>
                  </span>
                </div>
              </div>
              <div className={styles.flavourBox}>
                <div className={styles.flavour}>• Vanilla</div>
                <div className={styles.flavour}>• Salted Caramel</div>
                <div className={styles.flavour}>• Caramel</div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footerLine} />
        <footer className={styles.footer}>
          <span className={styles.igIcon}>
            <Instagram size={18} strokeWidth={1.8} />
          </span>
          <span className={styles.igHandle}>@backyardcoffeeandshop</span>
        </footer>
      </div>
    </div>
  );
}
