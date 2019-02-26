# vue-extend-template-loader
A loader for extending vue sfc templates alongside simple extension

## Usage example:

### Base Component
```
<template>
    <div class="test-1">
        <div class="hello">Hello</div>
        <div class="hi">Hi</div>
    </div>
</template>

<script>
export default {
    name: 'Test1'
};
</script>
```

### Extender Component
```
<template type="extend">
    <extenders>
        <extender query=".test-1" mode="append">
            <div class="howdy">Howdy!</div>
        </extender>
        <extender query=".hi" mode="delete" />
    </extenders>
</template>

<script>
import Test1 from 'src/test_1';

export default {
    name: 'Test2',
    extends: Test1,
    computed: {
        dizzy() {
            return true;
        }
    }
};
</script>
```

### Result component
```
<template>
    <div class="test-1">
        <div class="hello">Hello</div>
        <div class="howdy">Howdy!</div>
    </div>
</template>

<script>
export default {
    name: 'Test2',
    extends: Test1,
    computed: {
        dizzy() {
            return true;
        }
    }
};
</script>
```

## Supported operations (mode="append" for example)
append, prepend - appends or prepends markup to the queried node
delete, remove - deletes node
replace - replaces queried node with specified markup
after, before - inserts markup before or after queried node

