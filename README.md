**NOTE**: to use IT with 0.8.0, try the blaze branch of percolatestudio/iron-transitioner. YMMV

To use, simply place 

```
  {{> transitionerPanes}}
```

in your _master_ layout.

Notes:

1. Each page will be rendered within it's own layout.
2. The transitioner will skip between the left and right panes.
3. Here's some minimal CSS to get it going (you'll probably want significantly more than this):

```css
.transitioner-panes, .current-page, .next-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  -webkit-transform: translate3d(0, 0, 0);
  -webkit-transition: all 500ms ease-in;
}

.next-page {
  -webkit-transform: translate3d(100%, 0, 0);
}

.transitioner-panes.transitioning {
  -webkit-transform: translate3d(-100%, 0, 0);
}
```
