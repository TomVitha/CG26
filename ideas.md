## Theme classes?
Že namísto .btn-yellow/.tag-yellow/.alert-yellow atd, kde je třeba barevné varianty pro každý komponent, by mohl být generický "theme" kterým předáme jednotlivé odstíny, a komponenty pak pracují s danými odstíny

```css
.theme-yellow {
  yellow
  yellow lt
  contrast (fg)
  invert??
}
```


```html
  <button class="btn-sm theme-yellow"></button>
  <span class="badge theme-blue-lt">?lite?</span>
  <ul class="list theme-gray"></ul>
```

## Box
Obecný "content" box

```css
.box {
  padding: 24px;
  /* NEBO */
  padding: 40px;
  /* Nejspíš varianty velikosti */
}
```

## Alert component
```css
.alert {
  /* Jako Bootstrap/Tabler */
}
```

## Note
Poznámka v rámečku 

```css
.note {
	padding: 24px;
	border: 1px solid;
}
```