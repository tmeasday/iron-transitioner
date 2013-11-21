### Installation

Just `mrt add iron-transitioner`. That's it.

### Custom CSS

The built in CSS that's installed with IT probably won't work with your layout. 

If not, take a look at `transitioned_default_layout.less` for ideas.

**IMPORTANT**: You need to have a "null" transition on the `.transitioner-panes` to inform IT when the transition is over. The built in `default` transition uses a delayed transition to achieve this.

NOTE: If you don't want to fight the built in styles, just rename the default transition using `Router.transitionType()` (see below).

### Custom Layouts

If you want to use a layout, you can transition a yielded section simply by calling `{{transitionedYield}}`.

### Custom transition types

You can use:

```
Router.transitionType(function(fromTemplate, toTemplate) {});
```

to set the type of the transition based on the templates being used.

This type will be added to the `.transitioner-panes`, along with `.from-X` and `.to-Y` (where `X` and `Y` are the names of the templates being transitioned).