# Styling

The banner is a web component with a shadow DOM, so your site's CSS doesn't affect it. Use CSS variables and `::part()` to style it.

## CSS variables

Set them on `:root` or on the `cookie-consent` element:

```css
:root {
  --cc-primary-color: hsl(103 88% 28%);
  --cc-primary-color-invert: white;
  --cc-primary-color-dark: hsl(103 88% 22%);
  --cc-primary-color-dark-invert: white;
  --cc-secondary-color: lightgray;
  --cc-secondary-color-invert: black;
  --cc-secondary-color-dark: rgb(161 160 160);
  --cc-secondary-color-dark-invert: black;
  --cc-border-color: #8c8c8c;
  --cc-focus-color: black; /* defaults to --cc-text */
  --cc-background: white;
  --cc-text: black;
  --cc-overlay-background: rgb(255 255 255 / 0.5);
  --cc-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --cc-font-size: 14px;
}
```

| Variable                  | Used for |
| :------------------------ | :------- |
| `--cc-primary-color`      | "Save", switches that are on, the "New" and "Updated" labels |
| `--cc-secondary-color`    | "Decline", "Accept all", "Cancel", divider lines |
| `--cc-border-color`       | Switches that are off |
| `--cc-overlay-background` | The overlay behind the banner, only with `blockPage` |

`*-dark` is the hover color. `*-invert` is the text color on the matching background. Keep a contrast of at least 4.5:1 between the two. `--cc-border-color` needs a contrast of at least 3:1 against `--cc-background`.

In SCSS, use interpolation: `--cc-primary-color: #{$primary};`

## Parts

| Part        | Element |
| :---------- | :------ |
| `dialog`    | The banner |
| `button`    | Every button |
| `primary`   | "Save" |
| `secondary` | "Decline", "Accept all" and "Cancel" |
| `ghost`     | "Edit settings" |
| `switch`    | The switch of a policy |
| `switch-checked` | A switch that is on |
| `link`      | The links to the privacy policy and imprint |
| `details`   | The `<details>` element with a policy's provider, location and cookies |

```css
cookie-consent::part(dialog) {
  border-radius: 1rem;
}

cookie-consent::part(button) {
  border-radius: 999px;
}

cookie-consent::part(switch-checked) {
  background: darkblue;
}
```
