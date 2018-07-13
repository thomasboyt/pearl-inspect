# Pearl Inspect rewrite

* Two panel interface: left side contains entity list (ideally organized by parent-child tree), right side contains components
* Components should only show/edit primitives by default
* Add whitelist of special case editable objects
  * Coordinates
    * Should only ever replace the entire reference, allowing getters/setters to work

## New Component Serialization

On the top level, just have a whitelisted set of displayed fields. Then only display "flat" properties. The object tree view should just be removed entirely.

Field types:

- Number
- String
- Boolean (checkbox)
- Special objects
  - Coordinates
    - Can duck-type: if (typeof val === 'object' && matchesCoordinatesShape(val))
    - Could eventually give up and just make a Vector class to replace
  - References to entities
    - Should show as a _link_ to another entity
  - References to components
    - Should show as a _link_ to another component
- Array?
  - Not sure what this looks like yet

It might be useful to have some debug tools around "undisplayable" fields, like being able to `console.log()` them or something, letting Chrome deal with it.

It also might be worth it to just go ahead and make everything opt-in, especially since there's no way to reflect on private fields to avoid showing them:

```typescript
class Physical extends Component<PhysSettings> {
  @inspectable
  get center {}
  set center {}

  @inspectable
  get localCenter {}
  set localCenter {}

  _localCenter = {x: 0, y: 0}
}
```

It might even be worth making it something like `@inspectable('coordinates')`, just to remove any magic.

It also may be worth it to just make vectors an actual class to avoid this going forward, tbh. Then `reflect-metadata` could be used to automatically store the type of the inspectable field. This would also be a good way to enforce things about what is and isn't inspectable - e.g., error out if some weird union type is used, or a generic `Object` type.