# CMS


## Collection Types

Collection Types define the type of content that the CMS manages. For example: posts, messages, and surveys would all be collection types.

### CollectionType

|Property   |Type             |Description                                 |
|-----------|-----------------|--------------------------------------------|
|name       |String           |Human readable name                         |
|icon       |String           |Material icon to use in navigation          |
|templates  |Object           |Keyed templates (below)                     |

### Template
(I need to rename this to itemType)

|Property   |Type             |Description                                 |
|-----------|-----------------|--------------------------------------------|
|name       |String*          |Human readable name                         |
|preview    |Url              |Link to image preview of the template       |
|states     |Object*          |Keyed states (below)                        |

### State

|Property   |Type             |Description                                 |
|-----------|-----------------|--------------------------------------------|
|name       |String           |Human readable name                         |
|device     |Boolean (false)  |Whether to wrap the view in a device preview|
|url        |String*          |Url to view template                        |

### Registering a collectionType

A collectionType must be declared as an angular module that includes the collectionTypes module as a dependency. The collectionTypes module includes a $collectionTypes service that can be used to register new collectionTypes. The new collectionType module must make a call to $collectionTypes.registerCollectionType(id, collectionType) in its run block.

```javascript
angular.module('collectionType.survey', ['collectionTypes'])
.run(['$collectionTypes', function($collectionTypes){

    var templates = {
        'likert': {
            preview: './collectionTypes/survey/preview/likert.png',
            states: {
                editing: {
                    name: 'Editing',
                    device: true,
                    url: './collectionTypes/survey/editing/likert.html'
                },
                default: {
                    name: 'Preview',
                    device: true,
                    url: './collectionTypes/survey/default/likert.html',
                }
            }
        }
    }

    $collectionTypes.registerCollectionType('surveys', {
        name: 'Surveys',
        icon: 'aspect_ratio',
        templates: templates
    })

}])
```

---

## API

### collection

|Property    |Type               |Description                                 |
|------------|-------------------|--------------------------------------------|
|name        |string             |Name of the collection                      |


### item

|Property     |Type               |Description                                |
|-------------|-------------------|-------------------------------------------|
|collectionId |string*            |Parent collection                          |
|collectionRef|string             |Key to collection if item is referenced    |
|template     |string ("default") |Definition of states to render             |
|props        |object*            |The content                                |