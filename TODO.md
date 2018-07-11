# Pearl Inspect rewrite

* Two panel interface: left side contains entity list (ideally organized by parent-child tree), right side contains components
* Components should only show/edit primitives by default
* Add whitelist of special case editable objects
  * Coordinates
    * Should only ever replace the entire reference, allowing getters/setters to work
