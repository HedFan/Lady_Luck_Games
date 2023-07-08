# Lady_Luck_Games

LLG frontend test task

All required resources are uploaded to the "resources" folder.

### Install and launch
- npm i
- npm start

### Requirements
- Add labels with win sector value to the wheel
- On buttom click, make wheel spin to random sector and somehow show winning result

### Additional requirements (Optional tasks to show your skills in full)
- Animate wheel tongue collision with wheel hands
- Add input field to set target winning sector
- Stop wheel in the middle of sector
- Add possibility to alter wheel rotation using mouse cursor
- Button click animation


### Description:
- Labels with win sector value to the wheel have been added (10, 20, 30, 40, 60, 70).
- On the green spin button click wheel spins to a random sector, the wheel stops in the middle of the sector and the winning result can see on the green spin button. By default, the spin button doesn't have any text and after every spin, the text is reset. Also note that spin duration is 2000ms, after time is complete the wheel starts to search the closest sector. Speed for wheel spinning, time sinning and other configs you can change in a [configs.ts](src%2Fconfigs.ts).
- The wheel tongue is animated by collision with wheel hands. The speed of this collision depends on the wheel speed.
- It's possible to set a target winning sector in a gui panel in the top left corner. When the color of the sector has been chosen, then click on 'spin' button on the gui panel and the will starts spinning. After the spin is finished the result will appear on the spin button as usual. Note that spin duration is 2000ms, after time is complete the wheel starts to search a target sector. The dat.gui (v0.7.9) has been added in dependencies for that feature. 
- The wheel has the ability to rotate with a mouse.
- The spin button has a click animation and hover animation.

### [Try here](https://hedfan.github.io/Lady_Luck_Games/)
