This is me illustrating a ProseMirror-unaware approach to generating JSON patch patches, given only an input doc and a set of ProseMirror steps applied to that doc.

You can run via:

```
yarn run start
```

Sample output:

```
input ProseMirror doc:
{"type":"doc","content":[{"type":"text","text":"hi you"}]}
JSON Patch operations:
[
    {
        "op": "replace",
        "path": "/content/0/text",
        "value": "hi"
    },
    {
        "op": "add",
        "path": "/content/-",
        "value": {
            "type": "text",
            "marks": [
                {
                    "type": "bold"
                }
            ],
            "text": " there"
        }
    },
    {
        "op": "add",
        "path": "/content/-",
        "value": {
            "type": "text",
            "text": " you"
        }
    }
]
steps:
[
    {
        "stepType": "replace",
        "from": 2,
        "to": 2,
        "slice": {
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "bold"
                        }
                    ],
                    "text": " there"
                }
            ]
        }
    }
]
output doc (ProseMirror):
{"type":"doc","content":[{"type":"text","text":"hi"},{"type":"text","marks":[{"type":"bold"}],"text":" there"},{"type":"text","text":" you"}]}
output doc (JSON Patch):
{"type":"doc","content":[{"type":"text","text":"hi"},{"type":"text","marks":[{"type":"bold"}],"text":" there"},{"type":"text","text":" you"}]}
```