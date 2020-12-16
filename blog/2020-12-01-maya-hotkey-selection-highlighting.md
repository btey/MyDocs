---
slug: maya-hotkey-selection-highlighting
title: Autodesk Maya - HotKey for Selection Highlighting
author: Ben Tey
author_url: https://github.com/btey
author_image_url: ../static/img/avatar/avataaars.png
tags: [Autodesk, Maya, HotKey, Viewport, MEL]
---

To add a new HotKey in Autodesk Maya to switch the `Selection Highlighting` option in the `Show` menu of the viewport follow this steps:

1. Go to `Windows > Settings/Preferences > HotKey Editor`.

2. On the right side you can see a keyboard, showing which keys are already assigned.

3. Found an unassigned key or combination, go to Runtime Command Editor and press the `New` button.

4. Choose a name for this command (e.g. `SelectionHighlighting`) and be sure that MEL is the selected language.

5. Paste the following string in the text field:

```mel
string $mp = `getPanel -wf`; modelEditor -e -sel (!`modelEditor -q -sel $mp`) $mp;
```

6. Press the `Save Runtime Command` button. A message should pop up, confirming that your runtime command has been saved.

7. In the dropdown menu close to `Search By` choose `Runtime Command` and write in the text field the name of the command you have just created.

8. The command will appear in the `Custom Scripts` list.

9. Doubleclick in the `HotKey` column and enter the key or the keys combination you have chosen before.

10. Press the `Save and Close` button.

Now you should be able to switch the `Selection Highlighting` option with your new hotkey.
