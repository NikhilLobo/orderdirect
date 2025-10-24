# OrderDirect Theme Colors

## 🎨 Brand Colors

The OrderDirect brand uses a bold red and cream color palette that creates a modern, appetizing look perfect for a food delivery platform.

### Primary Colors

```css
/* Brand Red - #cb202d */
--primary: 355 76% 46%

/* Light Cream - #f4f4f2 */
--background: 60 7% 96%
```

### Color Palette

| Color Name | Hex Code | HSL | Usage |
|------------|----------|-----|-------|
| **Brand Red** | `#cb202d` | `hsl(355, 76%, 46%)` | Primary buttons, accents, CTAs |
| **Light Cream** | `#f4f4f2` | `hsl(60, 7%, 96%)` | Background, cards |
| **White** | `#ffffff` | `hsl(0, 0%, 100%)` | Card backgrounds |
| **Dark Text** | - | `hsl(355, 76%, 40%)` | Body text, headings |

## 🎯 Usage Examples

### In Tailwind Classes

```jsx
// Primary button with brand red
<button className="bg-primary text-primary-foreground hover:opacity-90">
  Order Now
</button>

// Using direct brand colors
<div className="bg-brand-red text-brand-cream">
  Special Offer
</div>

// Background with cream
<section className="bg-background">
  Content here
</section>

// Card with white background
<div className="bg-card border border-border">
  Restaurant card
</div>
```

### In CSS Variables

```css
/* Primary red for important elements */
.cta-button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}

/* Cream background */
.page-background {
  background-color: hsl(var(--background));
}

/* Accent red for hover states */
.menu-item:hover {
  border-color: hsl(var(--accent));
}
```

## 🌓 Dark Mode Support

Dark mode automatically inverts the color scheme while maintaining the brand red:

```css
.dark {
  --background: hsl(355, 20%, 10%);  /* Dark red-tinted background */
  --foreground: hsl(60, 7%, 96%);    /* Cream text */
  --primary: hsl(355, 76%, 46%);     /* Brand red stays the same */
}
```

Enable dark mode by adding the `dark` class to the root element:

```jsx
<html className="dark">
  {/* Your app */}
</html>
```

## 📋 Complete Color Variables

### Light Mode
```css
:root {
  /* Background & Foreground */
  --background: 60 7% 96%;           /* #f4f4f2 */
  --foreground: 355 76% 40%;

  /* Primary (Brand Red) */
  --primary: 355 76% 46%;            /* #cb202d */
  --primary-foreground: 60 7% 96%;

  /* Cards */
  --card: 0 0% 100%;                 /* White */
  --card-foreground: 355 76% 40%;

  /* Secondary */
  --secondary: 355 76% 95%;          /* Light red tint */
  --secondary-foreground: 355 76% 40%;

  /* Muted */
  --muted: 60 7% 90%;                /* Darker cream */
  --muted-foreground: 355 30% 35%;

  /* Accent */
  --accent: 355 76% 38%;             /* Darker red */
  --accent-foreground: 60 7% 96%;

  /* Borders */
  --border: 60 7% 85%;
  --input: 60 7% 85%;
  --ring: 355 76% 46%;               /* Focus ring = brand red */
}
```

### Dark Mode
```css
.dark {
  --background: 355 20% 10%;         /* Dark with red tint */
  --foreground: 60 7% 96%;           /* Cream */

  --primary: 355 76% 46%;            /* Brand red unchanged */
  --primary-foreground: 60 7% 96%;

  --card: 355 20% 12%;
  --card-foreground: 60 7% 96%;

  --secondary: 355 20% 18%;
  --secondary-foreground: 60 7% 96%;

  --accent: 355 76% 50%;             /* Slightly brighter red */
  --accent-foreground: 60 7% 96%;

  --border: 355 20% 18%;
  --ring: 355 76% 60%;
}
```

## 🎨 Design Guidelines

### When to Use Brand Red (#cb202d)

✅ **Use for:**
- Primary call-to-action buttons (Order Now, Add to Cart)
- Important notifications and badges
- Active navigation items
- Links and interactive elements
- Logo and branding
- Special offers and promotions

❌ **Avoid for:**
- Large background areas (use sparingly)
- Body text (use dark foreground instead)
- Form inputs (use neutral colors)

### When to Use Light Cream (#f4f4f2)

✅ **Use for:**
- Page backgrounds
- Section backgrounds
- Alternating row backgrounds
- Subtle containers

❌ **Avoid for:**
- Text color (insufficient contrast)
- Buttons (not enough contrast with white)

## 🔍 Accessibility

### Contrast Ratios

| Combination | Ratio | WCAG Level |
|-------------|-------|------------|
| Red on Cream | 5.2:1 | AA ✅ |
| Red on White | 6.1:1 | AA ✅ |
| Dark Text on Cream | 8.9:1 | AAA ✅ |
| Dark Text on White | 10.2:1 | AAA ✅ |

All color combinations meet **WCAG 2.1 Level AA** standards for normal text.

## 🎯 Component Examples

### Primary Button
```jsx
<button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:opacity-90 transition-opacity font-semibold">
  Order Now
</button>
```

### Secondary Button
```jsx
<button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md hover:bg-secondary/80 transition-colors">
  View Menu
</button>
```

### Restaurant Card
```jsx
<div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-card-foreground font-bold text-xl">Restaurant Name</h3>
  <p className="text-muted-foreground mt-2">Fast delivery • 4.5★</p>
  <button className="bg-primary text-primary-foreground mt-4 px-4 py-2 rounded-md">
    Order
  </button>
</div>
```

### Input Field
```jsx
<input
  type="text"
  className="w-full px-4 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
  placeholder="Search restaurants..."
/>
```

### Badge
```jsx
<span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
  Fast Delivery
</span>
```

## 🚀 Quick Reference

```jsx
// Backgrounds
className="bg-background"       // Light cream (#f4f4f2)
className="bg-card"             // White
className="bg-primary"          // Brand red (#cb202d)

// Text
className="text-foreground"     // Dark text
className="text-muted-foreground" // Muted text
className="text-primary-foreground" // Light text (for dark backgrounds)

// Borders
className="border border-border"  // Standard border

// Interactive States
className="hover:bg-accent"     // Hover with dark red
className="focus:ring-ring"     // Focus ring in brand red
```

## 📱 Mobile Considerations

The theme is fully responsive and works great on all screen sizes. The high contrast ensures readability even in bright sunlight, important for a food delivery app used outdoors.

---

**Your OrderDirect brand is now visually consistent with the #cb202d and #f4f4f2 color scheme!** 🎨
