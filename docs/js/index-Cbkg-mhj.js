var $=Object.defineProperty;var ee=(o,e,t)=>e in o?$(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var U=(o,e,t)=>ee(o,typeof e!="symbol"?e+"":e,t);import{ap as X,s as j,M as F,V as _,aM as te,n as r,h as g,W as T,al as D,aN as ie,am as V,x as ne,w as f,o as C,v as ae,aw as oe,e as se,P as G,a2 as re,aO as le,a3 as ce,aP as k,J as S,i as L,S as pe,a4 as z,af as N,aQ as me,a8 as Ae,at as fe,L as w,aR as de,aB as he,aS as ve,as as O,ar as ge,U as Z,aj as H,aT as ue,aU as Ie,aV as xe,aW as Ce,aX as we,O as Me}from"./threejs-DBMWHTjA.js";import{v as h,N as ye,O as Se,T as be,U as _e,X as Pe,l as J,b as Le,m as ze,i as W,c as B,d as E,F as Ee,n as Te,p as De,e as Re,q as Ne}from"./vendor-jP0BXN2k.js";import{_ as Oe}from"../lib/index-ChcEMU0S.js";const Fe=""+new URL("../gltf/sm_car-CVy47Bsp.gltf",import.meta.url).href,Ue=""+new URL("../bin/sm_car_data-cp9wt_Ti.bin",import.meta.url).href,Ve=""+new URL("../webp/sm_car_img0-5BpoYdbE.webp",import.meta.url).href,Ge="data:image/webp;base64,UklGRiwIAABXRUJQVlA4ICAIAADwMgCdASoAAoAAPm02mEkkIqIhIhIIuIANiWlu/HyZyOtPqd2X/4Lw/8l/sT2q5Tz0f3v/Rfk98hOxXeMfy//D/kpwXQAPy3+pf7b7dPk4mm3q//G5DqgB/Mf8t6Fv/b5ofo3/2f5j4Cv5L/av+v6w3r19FgOm5GXBGogZjDGGMMYYwxhjDGGMMYYwxhjDGGMMYYwxhjDF6o/LiXCqybGHiXEuJcS0NmI6vA5bzuhLtODpoq8t9MtwGW2AvBYt85o69ZvxY5TeIglGA24Meih5cMsHZTMaiuYDdXu5eMBb9e4h2k4CqY+7WZrD57cNpNTn47MaREs8MwdkvVH/YUGdawBmpfFinF+RDL9k7J2TpU0k6VbpVpQoh4ZvR2NEY+oIVd2HStiRCZOjsf+4VXlPd0Q6pohAWLgxTHMKa4mc1LaeaU4etUSO8HNH+CYWgsRaDGbjy5NDItKul8Ic+V7zaBB3s2kxDDQYu+kZ2CLlhqIGYwxhjDHLic2WevyvlxLiXEuJcS4lxLiXEuJcS4lxLiXEuJcS4lxLiXEuJcSzgAD+/7ZYIEAAPEXvAWzSYEzVTg3LsxKo3fhSCnfrE9SS6teiyq45WH0GHxsaPMFhuz0fKxlI+n0c+cu1PwD0HMx+tbBaNb/K1dObp19SkB7HegLstFttG04vChMlNCSygDj90kJXZ2LAqZG0W/VEuqlDYZF1afoKPCN3llJUntVq/6tWxTGSTB2DilvuXnWGcDMP+yXmm+WOw4viTdfvD76C9JjXuZCnhy/VXjcIk80njtQ7A76gQpwr/p1reBw+bId5Tvyl02Bl2fhMfUjiAC1kjscz6BpvKRMO5P/Hh2nhpydlvyEN08C3/8H9w8FURaNdhZtGTtkLAWqtGWDhnO1QICr80dxExr5zedgJX+na2CHxZsIQp+XsMTYSsrVQz+6tfca5bhN894RMIYb7N/UbwavQ9dMY3TMwDownNurH9CZ0kw9l6B/4kCeyUn/k+FXipNJWWEBQYMGVNQPpBOH9UJYlTViig/YecSJn7e2PYfck6hVproXT7WuE+9NrMEdrCkWP46QvN9bbZz8mu8PCAKAGgY5/KIxvF6C7NY6IDjSb88vzq4juAhSYRe9eDnqNNyy780trr2OVPH75TVhm2hdyLLooXr8797tynuVRXM0kkKrhSma0ptFr08fu/gvyKSRnPXXYYfBDuh3HFBa98020cLdE+qNVr+edDgRQ0LMYqQh0ikXoRO3T3OCYxW9JdLf9RxaA4DhDvYKL8Vo994eHquGqfBMMP8InictBKTSqXovolL3euG2+ZxIinc13/oo/n5AvCeqM6kpCJlj5x+ZXc/08uoyPxZWi50Fl8Sc6ETq4cnDiuzfy0Tnn8C7DLcYKU1yi2uk14pmxsLlJcbC9UccoG0BgoyRWk7bD5DysrWO+JWqgjeQ49TL2VN2DMDOsIvwZdlzfcDOeqR+F1S8EY+6aeAzvOruLTEbli9LjD8MHwajkKCo7Qdni4rr2FGzWIV57tjwWC9H+mEqo/Cia6FFkhOJaNM3MTk1VRbvAv4bkHYS9lCsGojgsxJPJJf4cELU70OJAQmSuUcuKBGv48N6Q0tFU4gvlYwraR6+eczJgJn8K6/WiKe7ZtwsGcUNmdTlp8CF3APmthrd+5uPgF0T9aWI74154MtW8j0+yeOeiawl40Pec/q6rmjiTxf/LHXoeQzkAGbssluciwLkCVMxCvWUlx+WzSblpjG3LdVHE0bnfgrgz5+RDwseeUU9nBXWb7OTC+hY5RFpVZx1HTo1T9BQhzGYoMWlQOaA4AGbylCZ7r/TTv3BVCushBtk2uTsevgtl6Eyxq0MWS5j882EkS0xcNQDO8QjL3fV3rgoSm8mYJHhDgntQ59yVEtQnVVQkuKMAioNEdX0elSbzlqC3PIg8ZUYlwhE8gsWGhJgWMRXOl2U/ip+TbOJCNDVtA0ltn7K9TZ4KxOGDxtnrkqzxyo8GZKQB1q2zOtyt1a4CLn9VmQJ4MNl3XD6x6cwUrdi4i41EuSoNYOAdO7/0sjcs7hO2gelb/yDB/YnzBt7EPPoZoMHdpzYBTf+yhqL0n01lprhRjTjFU9QMY5PXfHdFm83iVvs+OgFQYCuqv0i2hlhJinEigf36wsd09S818mmmCuh0cACQlJBBWrlMvCRqcfmGJ3GJLt09WPoEzj+TmFnPYMN4yZQt/eZ1ClHPAPwL+3B2dene3AaFDK3p4nnc96uRZxFgSZv9y7mqF/r9i9MNVBCZoosCHdzyWY2WcFLcEeF9uQ6ULifSaioc4pMj3iYXJnsDagb34gtqern4uLGLh6OIYM7tqOiZ4rlwzuWcj6/HuR7R1kE/1RQJphAqE/quXN0WtrUN9ztGMXIf4y28RbPLgIpayeu8X6S9EXUlw5xXG4j8FtJ2GV/gEtfEFuq5ITkfhITOimP7glhQ/+udLm3e5M7o39cEY2g+atEPnF7Ddd2x1TUwrRebOP9jpwHKvxOHxfdknLpksKf0lKXnYnTElJoXsXhFvfGxPfsmkDQ5FaOOYbYHvLPrC78NSAv1mHYRcQV3a2ewRkbAdr1RHmjofVz4nKIFOoP0AjfMKxEVDciUxHhUDtTxKzuXug0iP0P6wSJ2RA2TDXyBiLRM/6+HSEeV6mWda4gLsUAQ2GQlzrIwFx+P3LW1lUY4U2uRe2TcqJLYZ4TIsHRamezhKOCdLd94zxcaS4uQ1Y/rEzXTQNxN4+KTQBrxZ2HqOZNN4AAAAAAA",ke="data:image/webp;base64,UklGRmALAABXRUJQVlA4IFQLAADQOwCdASoAAoAAPm02mUkkIyKhIvb4gIANiU3fj5M5HWVgkYwoXwv9J/Gv3QKg/U/xJ65v5X9s3Szx1/LfNj8b/K/8F/Q/ym95n+i/oHuH/LX9d9wD9Pf1s6wH9U/yX+Z9gH7Cf9n/Ve6V/Y/+x/aPcR+rv6n/475AP55/f//h6tfsAf3H+1///3Bv2M///rg/sx8FH7i/s97Sv/36wDgSe2z/YZFNxd+w4ZdgzfywAfVz0UZr6sgaF5P9Q3pNh3T7xJiTEmJMSYkxJiTEmJMSYkxJiTEmJMSYkxJiTEmJMSXqds3ZuoQ3Zuzdm7N2bEOsbC6dr1EWkQ1Xk/8rCICwEIvl6y/mziRUaRWXxw9C+AmqRZp4hyW7E0tclGPdbOqT4mtF0jr+vGJRYGrOHTnsBF4IUzETIKLksOv2oxk8zXHtpx7T3H9haSZCJ4HGvv2BICQEZWFZNNT7ECNk4DwR2kAB5KbdVxDc8wzKgZ9PfZu4ctlHlwj4hlIv7uRZe/J1of23o7Zs/QP0F2EIBvX4YnTSsVLuR3HayD11SColXR+EA5Qag/PBkYJr9/OUMuv+teybGHiXEuLpE0rMomA8O2HSEqrLUoy4I0z7xJiTEmJMSYkxJiTEmJMSYkxJiTEmJMSYkuQAAP7/x1T8oNrnk+/2I5HFUAAAAAMn2CYTB5l2gdKp9NCfd/P0Akz4medihXPs+/nkO5n/7J+f6LNV/sG9b9HIcf/xJO7v6+m6eS44hSOdHXZYj20x7s3gv3D/G5msOvN+sbGQ4yYZ+b2/lB1ck1ZZqhgEuAEL3qpnYLn/yRxHSxd534DfRhM4vfI879A3GQXM2sV1jAAM5/udklTz4/maLszwzMcQSv0bY4KDD6UBNWf89BId3HiqrDPfEMTisYSBkVpZ/qCegtXVobt12nXNw2Ty5snPd+ngbYuzrA+pSnzekBjMkx/H5c/qA66TWQjQohlv4ggGF/aUFAPBpbmeTeVQq4e9r4xmG/mFLd81I1+h8b1+uSPibhauJKsyQgFtVFCZ9Ll0fBhCxVhw1foV74BnHBQc9OagA+1ycfuRQsSoprOksNDfMAlxCq2jrfGX81ugYBxe4jBINTNQtpmI8cFj2FRa0btQe0mzgFVZFh8KFM+Feu+L6d4SfRmgs62//NOAzA2qNS/rIkPz+03zYJQkcDIO4OM6+tPtVWED9l18WAHGZAD+B/cRxGr9VFvwJq3HUwa3HyATL5glyGXDOzirP3bhuhygpn3D4X4ObjoAwoHlRc2WXAdy7L9oxhpXOe2mZ/WRJotNpQoESB8/NBA2OOLKAfYbH2SmfZklFmGlWCbLbu8eGDpkkn4drs9s1jvybPbQxmHWOFIUf9CX6eRMLytlKpxCo8G40QmqZYMofMAkbShqEGMn9RNDZKF+ISdrvt66mH0HI4ZFnPYQbUMh7Mh+4IEMtXwSeFVEzRwNId3Cw69v4uVF+f2IykYDgMjqONlBmFRKO0qVb04RTlrS3zxw7WzbRfjDRuOSDK7PA5JujouPWfiQn3JQ2EhSJ5+9Cty+rgNQbylp56x66YnXDbkle81XV0Xyvx9gYfr5d72eiwnyNwTslB4rdP2Oy9if5SZIRJ4+OaOIvM9ZoHc9vsSqbHyRqGAE2mHHZtf+0w258HJgd5PEp5S1EJpWbHeJg18IsXufbZV6GsPqqih+OZuhEp27fCcX/2YDXLOTJMPZ1JT7lOnHQgUOdQNpiBEcCMCqlT0VCDyJKsOOv9ZMt0ZozP04itGNzYWSHvnHbCb56oBs2wbzC+9EA8CBHCffvwVnAzJbpd8vumY5c+wA6wUMWq+G8HRVerh+VHglP9YNMm9vcEqsujc3rcl8bcq74smOGr7TFpAFI4nMIGh+u/Y1FnGGQqa8n5cvfG+9yUd6IMf1z5voRjfUn5K4BQIl74wHir4/pXvHRrBi1DBPExIsb6QkXCcZfX0KhlFuE7uRQR6hp7+9fnH8KaBt2aqZBAX87wLBAGCwbntIeeHR+Ig1wI0M3zG/Qk4UG/olw0YrGheO8829U+9ts3VJ1MXA6BKhspEfgpPOpJMGqK0W2X4/woSO42kcxTsreTklSXiz4LKJ3OHKJRe5GF2Urii+5b2KD7GwpzI4nxDL4fGdsx+51mZI9Xc6UGqy4+1qQSQr3+aOh8ikZgV6lAqKj2T2VNmoWWgVLwZLfDqUu2RStUcVHAjlTwPoMA7VjRG16m1ANDu9RXFhvLKL/EoQK/BpeGrQ7e+AwPLABLm3b9358r+BT/tF2/bpdW6sbEovI1Zjwty6Q76fYdV1EceXPaw1XUQyHOiRW9s3DUwrdo5KNvfL01WswcK+NO56QkGJznZnXhjZFectyz1rZ6y34P4C91AhG0+48PliERdvtFGKo+TZLzVBxupaYh7+VAdC3l8dD/vihNbMYXdSJg0+ND2oNSRjCQE+Z7NjsPDjjLYVV2bp7swBZCet4HPNlWslxNexJAba9laK5XgLoO/tmpOF22zpodG2oj/qLJI8IFPJ/tstjcodHe3k1Z7P1ZfGZH2fYVH17zzlHyzLFugMxrP5IuGuhlKLSO3PMFbwx7LAfJQjtdqCt4zWNt9h3ZOAJ0yyuhOGNbr3FX7aL0a7Gfy75zdUHMAU6+01o0/MzieLQZcyEhvk1eBxzvSr2Xil7GgBaO/F672NghS04KpkYMFH4HjIg+/QiPQcefdhU0/qnhaVNv/ONsRCmqzteXgk+XMXzWCF4TYnTQn23Ydn8771I2WZRuu+Mf7hFl+i+nrLaYx3dda254mR9cYG9Ax3oYWrw5uqMBrKBXtMJudz0LtAJ8rNmUae5t3CjuqiwiRqFnYXFaYIjeR0VsCdEVRA14/T8kUCbv0uAOGr5m4eguzavQsb39xHr/Sf6W/2PHx6YDE9krnVm/wqdJUOY9Mp9bqWzeE7rgpsODlvWq59DRr2JYvZ3OWIGNA5SuEbTLlLPAKapFOHVjOiM0Ju4wyp1W4MufhTibPboy1rGPlKcI8Uk56n8i8AVzT/g6F4xh4YaEkZlJ3iKrRb1C9V5+hsydI5cM0PNKIqKM86LtelmV1uEiHFl6slc0x6RjmEkoObLdguTVvWZ4UNKxGEdy00b8E3ia/o1pZz02IfOIxoBV640MDbmncqhODiFB0i6ZFz/fjM1MGZmdh3cwB3N/CXHyFjDr9faQAhgJoHpcnh/HX67zZ7pvUxAepWpwa97Z63lWyybXPXhQ111eOpBYEVT/zcYSQGfjct21kKCLjNLU5apXlcdKgh85D8g3h6CEEiTAgwiBFTp6RdcXL2fp1El9VcylwcY43xT5NYQNQhb3RVP46Zs+16rFE0qThY8aqO42guBiJm3Z1pD9EeVYMVqq1Vko/AMAuQgQvREd40TdVGm+Z3dvbfYC8wDi8xjoWeybhuCMFNktn5NN4bOqWTpUpFpf7G60a6+VlqTPnFEMJIuEvrQC90HYPCzXJqJGGhNPMdJaq/kVU7Sgf61cg+qojbHlSTuNLuypWGmBaiG0bZr5ab+wZiB5vq5OCuyBbbvl7OLO62NmEIX+iLguNm/SSdk58SoJldWbVDHwxE6H7QrvKmkUCmG7OiHzww1j6yFyzY+rvb+IWsSQfN0wErZd6nXmE8biY9eeg+zEnLztUb8dN6PvF6eo/Ps9LhSSKYo8shhALGLt9YTYxixmupjfFysc7Wsu+CDGkF78CxDiH83sRgS53mUADIAHAu8NbV8hvHwZBAmF9+5xi89CaNSGWKOkFzhhb31mHIra67ArhRBI3bVVn4NwJsLWw+kv1tX/63cubgidIpzCc8NbK15bKAfPH0TeMQ7pXOQUAAAAAAAAAAAAAAAAAAAA==",Ze="data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAABwAgCdASoEAAQAAUAmJagCdGuAwQD1/wPQ7YGAAP7q8//6IeX/3YlL7Yb+Uid7y8o2f/xGT8D1nJ/Rv/ruvges5P6AAAAA",He="data:image/webp;base64,UklGRgACAABXRUJQVlA4IPQBAABQHgCdASoAAQABPm02mUgkIyKhJl1oYIANiWlu4XYBG/OLLK/AE0A69XHaSVPQPGaDNWVs0kqegeM0kqegeM0kqegeM0kqegeM0kqegeM0kqa67oLB99rCC4mJ6XKfUd5buWNQuZbu2VNiq2wOMFuS5HIf1Kmgh6xzalLx3Zt/jJTuopmizSViWgaazeT46VEecSjXJosqsmtgc4T2ytTNcmiyqya2BzhPbK1M1yaLKqgmzNg1N4dAOVBu0WKAJYtcB1brVRdh+JgQZT1+/CviU0kqfuXGbmYyklT0DxmklT0DxmklT0DxmklT0DxmklTvNMVFlbNJKnkWAAD+979NpoAARDWmeNfY32O2Hf4YnPj0R1elh5cgXR6n5z8006TVnHSXZr1LtXQSUqvwP/u2oDjVtOpku4F+VZOwvX4Yrx/mccWR3lFQlg/ZTAYNaYDpGT/oZDIvMPM5kfD47DMroqMBT9MZ39LflaIC2iFqhh0TjeM8h0J1Hzv1ZUTfXe4PyzRDJ+zB7T5dyYYkqjth5q2mA9ioxDv7zOBpKpD6ID8u7yN8odWZ6+Qbsg+wvQ9r5OxmiZ0XKuLkQVNrvCabjM47gTqJOs6iAiUT5oHr3WGFw/uA0D74/AIEawZQ42wQT4NRxrLU2OvQmika9+gAAAAAAA==",Je="data:image/webp;base64,UklGRmICAABXRUJQVlA4IFYCAACwIQCdASoAAQABPm02l0kkIyIhJXBoUIANiWVu4XYBA1z6uJ3j8LfykyE5YHoA/QDFAfq1+xnvAdH/1B/8g/yXA+ZGQAKC/wO403Gm403Gm403Gm403Gm403Gm403Gm403Gm403Gm403Gm40pYSkXAoSyiVVI5FlGCLUyMMY2waPuLSpHnMNhCLbLVz0DEBC667QwaXAnZm3F/jZd44jDEsM+EgVYmPNIrMimoBgKl5T6TE5ogS1RJA9MffoaSBUvKfSYr6Y+/bJ20t5m3F/U8GPDQZ+xiCqJWgs2NIPQpOknq2E1hUdyssN0TlJgdxtpiYgJKX7tM9pntM9pntM9pntM9pntM9pntM9pntM9pntM9pns0AAD+/6qH//00W3bg+YtnI9CwAAAAAAAuHW274ZB34fFu7uMK0EOIOdnkmA9nogS7TxKUkIGm3fDn1NvXrPlXFwn4DL0jdhutav1nf8AdbdWybaaJdDweI6UpIDAwCiv2QncA0ioeScP/w1/BxFLhSw8mC6Jdkickhsb/+JsunjerMC/MwFWo6quV8pCACIUWH4+swd/GpOqjFoTCSGM6/jCB3dicYiqPuEdx8dA/k5hFWuMOQ7tB9Ar8Ww2T8G3yRtmyEIeoCXmzBBCaB5iZEugKK549f8qgPnpBv16O1nuRfZk6fqlAFF3+B6nuUlvzd4XVX0nXpTpCi3zkjqD/+44UaPLMurHKuDfmAAj8RDSE/aDmAz5IaGUVWRJoWPFBvA6cuCtLfZf88OxvmC5vzYE17CkHv8AAAAAAABOYAAAA",We=""+new URL("../webp/sm_car_img6-CQUZkDrC.webp",import.meta.url).href,Be=""+new URL("../webp/sm_car_img7-BANFi2xN.webp",import.meta.url).href,Qe=""+new URL("../webp/sm_car_img8-NyCzxJH-.webp",import.meta.url).href,Ye="data:model/gltf+json;base64,ewogICJhc3NldCI6IHsKICAgICJnZW5lcmF0b3IiOiAiZ2xURi1UcmFuc2Zvcm0gdjMuMTAuMSIsCiAgICAidmVyc2lvbiI6ICIyLjAiCiAgfSwKICAiYWNjZXNzb3JzIjogWwogICAgewogICAgICAidHlwZSI6ICJTQ0FMQVIiLAogICAgICAiY29tcG9uZW50VHlwZSI6IDUxMjMsCiAgICAgICJjb3VudCI6IDI1OTIsCiAgICAgICJub3JtYWxpemVkIjogZmFsc2UsCiAgICAgICJieXRlT2Zmc2V0IjogMCwKICAgICAgImJ1ZmZlclZpZXciOiAwCiAgICB9LAogICAgewogICAgICAidHlwZSI6ICJWRUMyIiwKICAgICAgImNvbXBvbmVudFR5cGUiOiA1MTI2LAogICAgICAiY291bnQiOiA1ODYsCiAgICAgICJub3JtYWxpemVkIjogZmFsc2UsCiAgICAgICJieXRlT2Zmc2V0IjogMCwKICAgICAgImJ1ZmZlclZpZXciOiAxCiAgICB9LAogICAgewogICAgICAidHlwZSI6ICJWRUMzIiwKICAgICAgImNvbXBvbmVudFR5cGUiOiA1MTIwLAogICAgICAiY291bnQiOiA1ODYsCiAgICAgICJub3JtYWxpemVkIjogdHJ1ZSwKICAgICAgImJ5dGVPZmZzZXQiOiAwLAogICAgICAiYnVmZmVyVmlldyI6IDIKICAgIH0sCiAgICB7CiAgICAgICJ0eXBlIjogIlZFQzMiLAogICAgICAiY29tcG9uZW50VHlwZSI6IDUxMjIsCiAgICAgICJjb3VudCI6IDU4NiwKICAgICAgIm1heCI6IFsKICAgICAgICAzMjc2NywKICAgICAgICA4OTIsCiAgICAgICAgMTgwMAogICAgICBdLAogICAgICAibWluIjogWwogICAgICAgIC0zMjc2NywKICAgICAgICAtODkyLAogICAgICAgIC0xODAwCiAgICAgIF0sCiAgICAgICJub3JtYWxpemVkIjogdHJ1ZSwKICAgICAgImJ5dGVPZmZzZXQiOiA0Njg4LAogICAgICAiYnVmZmVyVmlldyI6IDEKICAgIH0KICBdLAogICJidWZmZXJWaWV3cyI6IFsKICAgIHsKICAgICAgImJ1ZmZlciI6IDAsCiAgICAgICJieXRlT2Zmc2V0IjogMCwKICAgICAgImJ5dGVMZW5ndGgiOiA1MTg0LAogICAgICAidGFyZ2V0IjogMzQ5NjMsCiAgICAgICJleHRlbnNpb25zIjogewogICAgICAgICJFWFRfbWVzaG9wdF9jb21wcmVzc2lvbiI6IHsKICAgICAgICAgICJidWZmZXIiOiAwLAogICAgICAgICAgImJ5dGVPZmZzZXQiOiAwLAogICAgICAgICAgImJ5dGVMZW5ndGgiOiA5ODYsCiAgICAgICAgICAibW9kZSI6ICJUUklBTkdMRVMiLAogICAgICAgICAgImJ5dGVTdHJpZGUiOiAyLAogICAgICAgICAgImNvdW50IjogMjU5MgogICAgICAgIH0KICAgICAgfQogICAgfSwKICAgIHsKICAgICAgImJ1ZmZlciI6IDAsCiAgICAgICJieXRlT2Zmc2V0IjogNTE4NCwKICAgICAgImJ5dGVMZW5ndGgiOiAyMTY0LAogICAgICAidGFyZ2V0IjogMzQ5NjIsCiAgICAgICJieXRlU3RyaWRlIjogOCwKICAgICAgImV4dGVuc2lvbnMiOiB7CiAgICAgICAgIkVYVF9tZXNob3B0X2NvbXByZXNzaW9uIjogewogICAgICAgICAgImJ1ZmZlciI6IDAsCiAgICAgICAgICAiYnl0ZU9mZnNldCI6IDk4OCwKICAgICAgICAgICJieXRlTGVuZ3RoIjogNTU0MSwKICAgICAgICAgICJtb2RlIjogIkFUVFJJQlVURVMiLAogICAgICAgICAgImJ5dGVTdHJpZGUiOiA4LAogICAgICAgICAgImNvdW50IjogMTE3MgogICAgICAgIH0KICAgICAgfQogICAgfSwKICAgIHsKICAgICAgImJ1ZmZlciI6IDAsCiAgICAgICJieXRlT2Zmc2V0IjogNzM0OCwKICAgICAgImJ5dGVMZW5ndGgiOiAwLAogICAgICAidGFyZ2V0IjogMzQ5NjIsCiAgICAgICJieXRlU3RyaWRlIjogNCwKICAgICAgImV4dGVuc2lvbnMiOiB7CiAgICAgICAgIkVYVF9tZXNob3B0X2NvbXByZXNzaW9uIjogewogICAgICAgICAgImJ1ZmZlciI6IDAsCiAgICAgICAgICAiYnl0ZU9mZnNldCI6IDY1MzIsCiAgICAgICAgICAiYnl0ZUxlbmd0aCI6IDgxNCwKICAgICAgICAgICJtb2RlIjogIkFUVFJJQlVURVMiLAogICAgICAgICAgImZpbHRlciI6ICJPQ1RBSEVEUkFMIiwKICAgICAgICAgICJieXRlU3RyaWRlIjogNCwKICAgICAgICAgICJjb3VudCI6IDU4NgogICAgICAgIH0KICAgICAgfQogICAgfQogIF0sCiAgImJ1ZmZlcnMiOiBbCiAgICB7CiAgICAgICJ1cmkiOiAic21fc3BlZWR1cF9kYXRhLmJpbiIsCiAgICAgICJieXRlTGVuZ3RoIjogNzM0OAogICAgfQogIF0sCiAgIm1lc2hlcyI6IFsKICAgIHsKICAgICAgIm5hbWUiOiAiUGxhbmUuMDMyIiwKICAgICAgInByaW1pdGl2ZXMiOiBbCiAgICAgICAgewogICAgICAgICAgImF0dHJpYnV0ZXMiOiB7CiAgICAgICAgICAgICJURVhDT09SRF8wIjogMSwKICAgICAgICAgICAgIk5PUk1BTCI6IDIsCiAgICAgICAgICAgICJQT1NJVElPTiI6IDMKICAgICAgICAgIH0sCiAgICAgICAgICAibW9kZSI6IDQsCiAgICAgICAgICAiaW5kaWNlcyI6IDAKICAgICAgICB9CiAgICAgIF0KICAgIH0KICBdLAogICJub2RlcyI6IFsKICAgIHsKICAgICAgIm5hbWUiOiAi5Yqg6YCfLjAwMiIsCiAgICAgICJ0cmFuc2xhdGlvbiI6IFsKICAgICAgICAwLAogICAgICAgIDMuMzM0NTkyNjQwMzk5OTMzLAogICAgICAgIC0wLjAwMDAwNDkxNzM4MzE5Mzk2OTcyNjYKICAgICAgXSwKICAgICAgInNjYWxlIjogWwogICAgICAgIDExNS45Mzk4NTc0ODI5MTAxNiwKICAgICAgICAxMTUuOTM5ODU3NDgyOTEwMTYsCiAgICAgICAgMTE1LjkzOTg1NzQ4MjkxMDE2CiAgICAgIF0sCiAgICAgICJtZXNoIjogMAogICAgfQogIF0sCiAgInNjZW5lcyI6IFsKICAgIHsKICAgICAgIm5hbWUiOiAiU2NlbmUiLAogICAgICAibm9kZXMiOiBbCiAgICAgICAgMAogICAgICBdCiAgICB9CiAgXSwKICAic2NlbmUiOiAwLAogICJleHRlbnNpb25zVXNlZCI6IFsKICAgICJLSFJfbWVzaF9xdWFudGl6YXRpb24iLAogICAgIkVYVF9tZXNob3B0X2NvbXByZXNzaW9uIgogIF0sCiAgImV4dGVuc2lvbnNSZXF1aXJlZCI6IFsKICAgICJLSFJfbWVzaF9xdWFudGl6YXRpb24iLAogICAgIkVYVF9tZXNob3B0X2NvbXByZXNzaW9uIgogIF0KfQ==",Xe=""+new URL("../bin/sm_speedup_data-yju0ekBc.bin",import.meta.url).href,je=""+new URL("../gltf/sm_startroom.raw-Bc_YJIc0.gltf",import.meta.url).href,Ke="data:application/octet-stream;base64,exI9wEzGcj3VL7W/exI9QEzGcj3VL7W/exI9wFTFcj3VL7U/exI9QFTFcj3VL7U/ANudPE0yfj8oEXs/TTJ+PwDbnTyA2eY7KBF7P4DZ5jsAAAAAAACAvwAAAIAAAAAAAACAvwAAAIAAAAAAAACAvwAAAIAAAAAAAACAvwAAAIAAAAEAAwAAAAMAAgBs6EjAAAAAAEsScEE+9dZBAAAAAFUScEFs6EjAAAAAAE0ScME+9dZBAAAAAEMScME6nP9CAAAAAJEScEE6nP9CAAAAAAcScMErJtDCAAAAAA8ScEErJtDCAAAAAIkScMEAAIA/tJAQPwAAgD+Y3t4+E9zCMrWQED8AAAAAmt7ePgAAgD8AAIAzE9xCMwAAADQAAIA//v9/PxPcwjIAAIA/cRNdPzyyCz6BiKk6PLILPnETXT88q38/gYipOjyrfz+BiKk6PLILPoGIqTo8q38/cRNdPzyyCz5xE10/PKt/PwAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAAAAAAAAIA/AAAAgAMAAgAAAAMAAAABAAMAAQAEAAMABAAFAAAAAgAHAAAABwAGAA==",qe=""+new URL("../jpg/t_car_body_AO.raw-DDaCyunv.jpg",import.meta.url).href,$e=""+new URL("../hdr/t_env_light-r6ZBsESp.hdr",import.meta.url).href,et=""+new URL("../hdr/t_env_night-CM2brvZS.hdr",import.meta.url).href,tt=""+new URL("../webp/t_floor_normal-Dkb3ePHO.webp",import.meta.url).href,it=""+new URL("../webp/t_floor_roughness-B2nbKZpC.webp",import.meta.url).href,nt=""+new URL("../jpg/t_startroom_ao.raw-D7VSwjeN.jpg",import.meta.url).href,at=""+new URL("../jpg/t_startroom_light.raw-T73eKq7L.jpg",import.meta.url).href;class Q{get camera(){return this._camera}get material(){return this._mesh.material}set material(e){this._mesh.material=e}constructor(e){const t=new X(-1,1,1,-1,0,1),i=new j(2,2);this._mesh=new F(i,e),this._camera=t}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,this._camera)}}const ot=`

	// Without original size argument for power of two targets
	vec4 packedTexture2DLOD( sampler2D tex, vec2 uv, int level ) {

		// the fraction of the uv space used by the target mip
		float targetSubview = 1.0 / pow( 2.0, float( level ) );
		float widthRatio = 2.0 / 3.0;
		vec2 scaledDimensions = vec2( targetSubview * widthRatio, targetSubview );

		// all levels > 0 are on the right third of the texture
		// y is offset from the bottom
		vec2 offset = vec2(
			level > 0 ? widthRatio : 0.0,
			level > 0 ? targetSubview : 0.0
		);

		vec2 samplePoint = mix( offset, offset + scaledDimensions, uv );
		return texture2D( tex, samplePoint );

	}

	vec4 packedTexture2DLOD( sampler2D tex, vec2 uv, float level ) {

		float ratio = mod( level, 1.0 );
		int minLevel = int( floor( level ) );
		int maxLevel = int( ceil( level ) );

		vec4 minValue = packedTexture2DLOD( tex, uv, minLevel );
		vec4 maxValue = packedTexture2DLOD( tex, uv, maxLevel );

		return mix( minValue, maxValue, ratio );

	}

	// With original size argument
	vec4 packedTexture2DLOD( sampler2D tex, vec2 uv, int level, vec2 originalPixelSize ) {

		float floatLevel = float( level );
		vec2 atlasSize;
		atlasSize.x = floor( originalPixelSize.x * 1.5 );
		atlasSize.y = originalPixelSize.y;

		// we stop making mip maps when one dimension == 1
		float maxLevel = min( floor( log2( originalPixelSize.x ) ), floor( log2( originalPixelSize.y ) ) );
		floatLevel = min( floatLevel, maxLevel );

		// use inverse pow of 2 to simulate right bit shift operator
		vec2 currentPixelDimensions = floor( originalPixelSize / pow( 2.0, floatLevel ) );
		vec2 pixelOffset = vec2(
			floatLevel > 0.0 ? originalPixelSize.x : 0.0,
			floatLevel > 0.0 ? currentPixelDimensions.y : 0.0
		);

		// "minPixel / atlasSize" samples the top left piece of the first pixel
		// "maxPixel / atlasSize" samples the bottom right piece of the last pixel
		vec2 minPixel = pixelOffset;
		vec2 maxPixel = pixelOffset + currentPixelDimensions;
		vec2 samplePoint = mix( minPixel, maxPixel, uv );
		samplePoint /= atlasSize;

		vec2 halfPixelSize = 1.0 / ( 2.0 * atlasSize );
		samplePoint = min( samplePoint, maxPixel / atlasSize - halfPixelSize );
		samplePoint = max( samplePoint, minPixel / atlasSize + halfPixelSize );

		return texture2D( tex, samplePoint );

	}

	vec4 packedTexture2DLOD( sampler2D tex, vec2 uv, float level, vec2 originalPixelSize ) {

		float ratio = mod( level, 1.0 );
		int minLevel = int( floor( level ) );
		int maxLevel = int( ceil( level ) );

		vec4 minValue = packedTexture2DLOD( tex, uv, minLevel, originalPixelSize );
		vec4 maxValue = packedTexture2DLOD( tex, uv, maxLevel, originalPixelSize );

		return mix( minValue, maxValue, ratio );

	}

`;function b(o){const e={...o};return"defines"in o&&(e.defines={...o.defines}),"uniforms"in o&&(e.uniforms=te.clone(o.uniforms)),e}const st={defines:{X_IS_EVEN:1,Y_IS_EVEN:1},uniforms:{map:{value:null},originalMapSize:{value:new _},parentMapSize:{value:new _},parentLevel:{value:0}},vertexShader:`
		varying vec2 vUv;
		void main() {

			#include <begin_vertex>
			#include <project_vertex>
			vUv = uv;

		}
	`,fragmentShader:`
		varying vec2 vUv;
		uniform sampler2D map;
		uniform int parentLevel;
		uniform vec2 parentMapSize;
		uniform vec2 originalMapSize;

		${ot}

		#if X_IS_EVEN && Y_IS_EVEN

		#define SAMPLES 4
		#define WIDTH 2
		#define HEIGHT 2

		#elif X_IS_EVEN

		#define SAMPLES 6
		#define WIDTH 2
		#define HEIGHT 3

		#elif Y_IS_EVEN

		#define SAMPLES 6
		#define WIDTH 3
		#define HEIGHT 2

		#else

		#define SAMPLES 9
		#define WIDTH 3
		#define HEIGHT 3

		#endif

		vec4 sampleAt( vec2 uv ) {

			return packedTexture2DLOD( map, uv, parentLevel, originalMapSize );

		}

		void main() {

			vec2 childMapSize = parentMapSize / 2.0;
			// vec2 childPixelSize = 1.0 / childMapSize;
			// vec2 halfChildPixelSize = childPixelSize / 2.0;
			vec2 childPixelPos = floor( vUv * childMapSize );

			vec2 parentPixelSize = 1.0 / parentMapSize;
			vec2 halfParentPixelSize = parentPixelSize / 2.0;
			vec2 parentPixelPos = childPixelPos * 2.0;

			vec2 baseUv = ( parentPixelPos / parentMapSize ) + halfParentPixelSize;

			vec4 samples[ SAMPLES ];
			float weights[ SAMPLES ];

			#if X_IS_EVEN && Y_IS_EVEN

			samples[ 0 ] = sampleAt( baseUv );
			samples[ 1 ] = sampleAt( baseUv + vec2( parentPixelSize.x, 0.0 ) );
			samples[ 2 ] = sampleAt( baseUv + vec2( 0.0, parentPixelSize.y ) );
			samples[ 3 ] = sampleAt( baseUv + vec2( parentPixelSize.x, parentPixelSize.y ) );

			weights[ 0 ] = 0.25;
			weights[ 1 ] = 0.25;
			weights[ 2 ] = 0.25;
			weights[ 3 ] = 0.25;

			#elif X_IS_EVEN

			float wx0 = 0.5;
			float wx1 = 0.5;

			float yden = 2.0 * parentMapSize.y + 1.0;
			float wy0 = ( parentMapSize.y - parentPixelPos.y ) / yden;
			float wy1 = ( parentMapSize.y ) / yden;
			float wy2 = ( parentPixelPos.y + 1.0 ) / yden;

			samples[ 0 ] = sampleAt( baseUv );
			samples[ 1 ] = sampleAt( baseUv + vec2( parentPixelSize.x, 0.0 ) );

			samples[ 2 ] = sampleAt( baseUv + vec2( 0.0, parentPixelSize.y ) );
			samples[ 3 ] = sampleAt( baseUv + vec2( parentPixelSize.x, parentPixelSize.y ) );

			samples[ 4 ] = sampleAt( baseUv + vec2( 0.0, 2.0 * parentPixelSize.y ) );
			samples[ 5 ] = sampleAt( baseUv + vec2( parentPixelSize.x, 2.0 * parentPixelSize.y ) );

			weights[ 0 ] = wx0 * wy0;
			weights[ 1 ] = wx1 * wy0;

			weights[ 2 ] = wx0 * wy1;
			weights[ 3 ] = wx1 * wy1;

			weights[ 4 ] = wx0 * wy2;
			weights[ 5 ] = wx1 * wy2;

			#elif Y_IS_EVEN

			float xden = 2.0 * parentMapSize.x + 1.0;
			float wx0 = ( parentMapSize.x - parentPixelPos.x ) / xden;
			float wx1 = ( parentMapSize.x ) / xden;
			float wx2 = ( parentPixelPos.x + 1.0 ) / xden;

			float wy0 = 0.5;
			float wy1 = 0.5;

			samples[ 0 ] = sampleAt( baseUv );
			samples[ 1 ] = sampleAt( baseUv + vec2( parentPixelSize.x, 0.0 ) );
			samples[ 2 ] = sampleAt( baseUv + vec2( 2.0 * parentPixelSize.x, 0.0 ) );

			samples[ 3 ] = sampleAt( baseUv + vec2( 0.0, parentPixelSize.y ) );
			samples[ 4 ] = sampleAt( baseUv + vec2( parentPixelSize.x, parentPixelSize.y ) );
			samples[ 5 ] = sampleAt( baseUv + vec2( 2.0 * parentPixelSize.x, parentPixelSize.y ) );

			weights[ 0 ] = wx0 * wy0;
			weights[ 1 ] = wx1 * wy0;
			weights[ 2 ] = wx2 * wy0;

			weights[ 3 ] = wx0 * wy1;
			weights[ 4 ] = wx1 * wy1;
			weights[ 5 ] = wx2 * wy1;

			#else

			float xden = 2.0 * parentMapSize.x + 1.0;
			float wx0 = ( parentMapSize.x - parentPixelPos.x ) / xden;
			float wx1 = ( parentMapSize.x ) / xden;
			float wx2 = ( parentPixelPos.x + 1.0 ) / xden;

			float yden = 2.0 * parentMapSize.y + 1.0;
			float wy0 = ( parentMapSize.y - parentPixelPos.y ) / yden;
			float wy1 = ( parentMapSize.y ) / yden;
			float wy2 = ( parentPixelPos.y + 1.0 ) / yden;

			samples[ 0 ] = sampleAt( baseUv );
			samples[ 1 ] = sampleAt( baseUv + vec2( parentPixelSize.x, 0.0 ) );
			samples[ 2 ] = sampleAt( baseUv + vec2( 2.0 * parentPixelSize.x, 0.0 ) );

			samples[ 3 ] = sampleAt( baseUv + vec2( 0.0, parentPixelSize.y ) );
			samples[ 4 ] = sampleAt( baseUv + vec2( parentPixelSize.x, parentPixelSize.y ) );
			samples[ 5 ] = sampleAt( baseUv + vec2( 2.0 * parentPixelSize.x, parentPixelSize.y ) );

			samples[ 6 ] = sampleAt( baseUv + vec2( 0.0, 2.0 * parentPixelSize.y ) );
			samples[ 7 ] = sampleAt( baseUv + vec2( parentPixelSize.x, 2.0 * parentPixelSize.y ) );
			samples[ 8 ] = sampleAt( baseUv + vec2( 2.0 * parentPixelSize.x, 2.0 * parentPixelSize.y ) );

			weights[ 0 ] = wx0 * wy0;
			weights[ 1 ] = wx1 * wy0;
			weights[ 2 ] = wx2 * wy0;

			weights[ 3 ] = wx0 * wy1;
			weights[ 4 ] = wx1 * wy1;
			weights[ 5 ] = wx2 * wy1;

			weights[ 6 ] = wx0 * wy2;
			weights[ 7 ] = wx1 * wy2;
			weights[ 8 ] = wx2 * wy2;

			#endif

			<mipmap_logic>

		}
	`},Y=new r;class rt{constructor(e){e||(e=`

				#pragma unroll_loop
				for ( int i = 0; i < SAMPLES; i ++ ) {

					gl_FragColor += samples[ i ] * weights[ i ];

				}

			`);const t=b(st);t.fragmentShader=t.fragmentShader.replace(/<mipmap_logic>/g,e);const i=new Array(4);i[0]=new g(b(t)),i[0].defines.X_IS_EVEN=0,i[0].defines.Y_IS_EVEN=0,i[1]=new g(b(t)),i[1].defines.X_IS_EVEN=1,i[1].defines.Y_IS_EVEN=0,i[2]=new g(b(t)),i[2].defines.X_IS_EVEN=0,i[2].defines.Y_IS_EVEN=1,i[3]=new g(b(t)),i[3].defines.X_IS_EVEN=1,i[3].defines.Y_IS_EVEN=1;const n=new T;n.texture.minFilter=D,n.texture.magFilter=D,this._swapTarget=n,this._copyQuad=new Q(new g(ie)),this._mipQuad=new Q(null),this._mipMaterials=i}update(e,t,i,n=!1){e.isWebGLRenderTarget&&(e=e.texture);const l=i.autoClear,p=i.getClearAlpha(),m=i.getRenderTarget();i.getClearColor(Y);const c=this._copyQuad,a=this._mipQuad,s=this._swapTarget,M=this._mipMaterials;let A,u;n?(A=V.floorPowerOfTwo(e.image.width),u=V.floorPowerOfTwo(e.image.height)):(A=Math.floor(e.image.width),u=Math.floor(e.image.height));const P=Math.floor(A*1.5),y=Math.floor(u);t.setSize(P,y),s.texture.type!==t.texture.type?(s.dispose(),s.copy(t),s.texture.image={...s.texture.image}):s.setSize(P,y),i.autoClear=!1,i.setClearColor(0),i.setClearAlpha(),c.material.uniforms.tDiffuse.value=e,c.camera.setViewOffset(A,u,0,0,P,y),i.setRenderTarget(t),i.clear(),c.render(i),i.setRenderTarget(s),i.clear(),c.render(i);let I=A,v=u,R=0;for(;I>1&&v>1;){const K=(I%2===0?1:0)|(v%2===0?2:0),x=M[K];x.uniforms.map.value=s.texture,x.uniforms.parentLevel.value=R,x.uniforms.parentMapSize.value.set(I,v),x.uniforms.originalMapSize.value.set(A,u),a.material=x,I=Math.floor(I/2),v=Math.floor(v/2);const q=y-2*v;i.setRenderTarget(t),a.camera.setViewOffset(I,v,-A,-q,P,y),a.render(i),i.setRenderTarget(s),x.uniforms.map.value=t.texture,a.render(i),R++}return i.setRenderTarget(m),i.setClearAlpha(p),i.setClearColor(Y),i.autoClear=l,R+1}dispose(){this._swapTarget.dispose(),this._mipQuad.dispose(),this._copyQuad.dispose(),this._mipMaterials.forEach(e=>e.dispose())}}var lt=`uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=vec4(p,1.);

    vUv=uv;
}`,ct=`uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform sampler2D uEnvmap1;
uniform sampler2D uEnvmap2;
uniform float uWeight;
uniform float uIntensity;

void main(){
    vec2 uv=vUv;
    vec3 envmap1=texture(uEnvmap1,uv).xyz;
    vec3 envmap2=texture(uEnvmap2,uv).xyz;
    vec3 col=mix(envmap1,envmap2,uWeight)*uIntensity;
    gl_FragColor=vec4(col,1.);
}`,pt=`uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv_;
varying vec4 vWorldPosition;

void main(){
    vec3 p=position;

    csm_Position=p;

    vUv_=uv;
    vWorldPosition=modelMatrix*vec4(p,1);
}`,mt=`#ifndef FNC_POW5
#define FNC_POW5

float pow5(const in float v) {
    float v2 = v * v;
    return v2 * v2 * v;
}

vec2 pow5(const in vec2 v) {
    vec2 v2 = v * v;
    return v2 * v2 * v;
}

vec3 pow5(const in vec3 v) {
    vec3 v2 = v * v;
    return v2 * v2 * v;
}

vec4 pow5(const in vec4 v) {
    vec4 v2 = v * v;
    return v2 * v2 * v;
}

#endif

#ifndef FNC_SCHLICK
#define FNC_SCHLICK

vec3 schlick(const in vec3 f0, const in float f90, const in float VoH) {
    float f = pow5(1.0 - VoH);
    return f + f0 * (f90 - f);
}

vec3 schlick(const in vec3 f0, const in vec3 f90, const in float VoH) {
    return f0 + (f90 - f0) * pow5(1.0 - VoH);
}

float schlick(const in float f0, const in float f90, const in float VoH) {
    return f0 + (f90 - f0) * pow5(1.0 - VoH);
}

#endif

#ifndef FNC_POW5
#define FNC_POW5

float pow5(const in float v) {
    float v2 = v * v;
    return v2 * v2 * v;
}

vec2 pow5(const in vec2 v) {
    vec2 v2 = v * v;
    return v2 * v2 * v;
}

vec3 pow5(const in vec3 v) {
    vec3 v2 = v * v;
    return v2 * v2 * v;
}

vec4 pow5(const in vec4 v) {
    vec4 v2 = v * v;
    return v2 * v2 * v;
}

#endif
#ifndef EIGHTH_PI
#define EIGHTH_PI 0.39269908169
#endif
#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439  
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE 
#define GOLDEN_ANGLE 2.39996323
#endif
#ifndef DEG2RAD
#define DEG2RAD (PI / 180.0)
#endif
#ifndef RAD2DEG
#define RAD2DEG (180.0 / PI)
#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif

#ifndef FNC_FRESNEL
#define FNC_FRESNEL

vec3 fresnel(const in vec3 f0, vec3 normal, vec3 view) {
   return schlick(f0, 1.0, dot(view, normal));
}

vec3 fresnel(const in vec3 f0, const in float NoV) {
#if defined(TARGET_MOBILE) || defined(PLATFORM_RPI)
    return schlick(f0, 1.0, NoV);
#else
    float f90 = saturate(dot(f0, vec3(50.0 * 0.33)));
    return schlick(f0, f90, NoV);
#endif
}

float fresnel(const in float f0, const in float NoV) {
    return schlick(f0, 1.0, NoV);
}

vec3 fresnel(vec3 f0, float NoV, float roughness) {
    return f0 + (max(vec3(1.0 - roughness), f0) - f0) * pow5(1.0 - NoV);
}

#endif
#ifndef SAMPLER_FNC
#if __VERSION__ >= 300
#define SAMPLER_FNC(TEX, UV) texture(TEX, UV)
#else
#define SAMPLER_FNC(TEX, UV) texture2D(TEX, UV)
#endif
#endif

#ifndef SAMPLER_TYPE
#define SAMPLER_TYPE sampler2D
#endif

#ifndef FNC_SAMPLEBICUBIC
#define FNC_SAMPLEBICUBIC

vec4 sampleBicubic(float v) {
    vec4 n = vec4(1.0, 2.0, 3.0, 4.0) - v;
    vec4 s = n * n * n;
    vec4 o;
    o.x = s.x;
    o.y = s.y - 4.0 * s.x;
    o.z = s.z - 4.0 * s.y + 6.0 * s.x;
    o.w = 6.0 - o.x - o.y - o.z;
    return o;
}

vec4 sampleBicubic(SAMPLER_TYPE tex, vec2 st, vec2 texResolution) {
    vec2 pixel = 1.0 / texResolution;
    st = st * texResolution - 0.5;

    vec2 fxy = fract(st);
    st -= fxy;

    vec4 xcubic = sampleBicubic(fxy.x);
    vec4 ycubic = sampleBicubic(fxy.y);

    vec4 c = st.xxyy + vec2 (-0.5, 1.5).xyxy;

    vec4 s = vec4(xcubic.xz + xcubic.yw, ycubic.xz + ycubic.yw);
    vec4 offset = c + vec4 (xcubic.yw, ycubic.yw) / s;

    offset *= pixel.xxyy;

    vec4 sample0 = SAMPLER_FNC(tex, offset.xz);
    vec4 sample1 = SAMPLER_FNC(tex, offset.yz);
    vec4 sample2 = SAMPLER_FNC(tex, offset.xw);
    vec4 sample3 = SAMPLER_FNC(tex, offset.yw);

    float sx = s.x / (s.x + s.y);
    float sy = s.z / (s.z + s.w);

    return mix( mix(sample3, sample2, sx), 
                mix(sample1, sample0, sx), 
                sy);
}

#endif
vec4 packedTexture2DLOD(sampler2D tex,vec2 uv,int level,vec2 originalPixelSize){\r
    float floatLevel=float(level);\r
    vec2 atlasSize;\r
    atlasSize.x=floor(originalPixelSize.x*1.5);\r
    atlasSize.y=originalPixelSize.y;\r
    
    float maxLevel=min(floor(log2(originalPixelSize.x)),floor(log2(originalPixelSize.y)));\r
    floatLevel=min(floatLevel,maxLevel);\r
    
    vec2 currentPixelDimensions=floor(originalPixelSize/pow(2.,floatLevel));\r
    vec2 pixelOffset=vec2(\r
        floatLevel>0.?originalPixelSize.x:0.,\r
        floatLevel>0.?currentPixelDimensions.y:0.\r
    );\r
    
    
    vec2 minPixel=pixelOffset;\r
    vec2 maxPixel=pixelOffset+currentPixelDimensions;\r
    vec2 samplePoint=mix(minPixel,maxPixel,uv);\r
    samplePoint/=atlasSize;\r
    vec2 halfPixelSize=1./(2.*atlasSize);\r
    samplePoint=min(samplePoint,maxPixel/atlasSize-halfPixelSize);\r
    samplePoint=max(samplePoint,minPixel/atlasSize+halfPixelSize);\r
    return sampleBicubic(tex,samplePoint,originalPixelSize);\r
}

vec4 packedTexture2DLOD(sampler2D tex,vec2 uv,float level,vec2 originalPixelSize){\r
    float ratio=mod(level,1.);\r
    int minLevel=int(floor(level));\r
    int maxLevel=int(ceil(level));\r
    vec4 minValue=packedTexture2DLOD(tex,uv,minLevel,originalPixelSize);\r
    vec4 maxValue=packedTexture2DLOD(tex,uv,maxLevel,originalPixelSize);\r
    return mix(minValue,maxValue,ratio);\r
}

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv_;
varying vec4 vWorldPosition;

uniform vec3 uColor;
uniform float uSpeed;
uniform mat4 uReflectMatrix;
uniform sampler2D uReflectTexture;
uniform float uReflectIntensity;
uniform vec2 uMipmapTextureSize;

void main(){
    vec2 p=vUv_;

    vec2 surfaceNormalUv=vWorldPosition.xz;
    surfaceNormalUv.x+=iTime*uSpeed;
    vec3 surfaceNormal=texture(normalMap,surfaceNormalUv).rgb*2.-1.;
    surfaceNormal=surfaceNormal.rbg;
    surfaceNormal=normalize(surfaceNormal);

    vec3 viewDir=vViewPosition;
    float d=length(viewDir);
    viewDir=normalize(viewDir);

    vec2 distortion=surfaceNormal.xz*(.001+1./d);

    vec4 reflectPoint=uReflectMatrix*vWorldPosition;
    reflectPoint=reflectPoint/reflectPoint.w;

    
    vec2 roughnessUv=vWorldPosition.xz;
    roughnessUv.x+=iTime*uSpeed;
    float roughnessValue=texture(roughnessMap,roughnessUv).r;
    roughnessValue=roughnessValue*(1.7-.7*roughnessValue);
    roughnessValue*=4.;
    float level=roughnessValue;
    vec2 finalUv=reflectPoint.xy+distortion;
    vec3 reflectionSample=packedTexture2DLOD(uReflectTexture,finalUv,level,uMipmapTextureSize).rgb;
    reflectionSample*=uReflectIntensity;

    vec3 col=uColor;
    
    col*=3.;
    vec3 fres=fresnel(vec3(0.),vNormal,viewDir);
    col=mix(col,reflectionSample,fres);

    csm_DiffuseColor=vec4(col,1.);
}`,At=`uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);

    vUv=uv;
}`,ft=`vec2 hash(vec2 p)
{\r
    p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));\r
    return-1.+2.*fract(sin(p)*43758.5453123);\r
}

float noise(in vec2 p)\r
{\r
    const float K1=.366025404;
    const float K2=.211324865;
    \r
    vec2 i=floor(p+(p.x+p.y)*K1);\r
    vec2 a=p-i+(i.x+i.y)*K2;\r
    float m=step(a.y,a.x);\r
    vec2 o=vec2(m,1.-m);\r
    vec2 b=a-o+K2;\r
    vec2 c=a-1.+2.*K2;\r
    vec3 h=max(.5-vec3(dot(a,a),dot(b,b),dot(c,c)),0.);\r
    vec3 n=h*h*h*h*vec3(dot(a,hash(i+0.)),dot(b,hash(i+o)),dot(c,hash(i+1.)));\r
    return dot(n,vec3(70.));\r
}
#ifndef RANDOM_SCALE
#ifdef RANDOM_HIGHER_RANGE
#define RANDOM_SCALE vec4(.1031, .1030, .0973, .1099)
#else
#define RANDOM_SCALE vec4(443.897, 441.423, .0973, .1099)
#endif
#endif

#ifndef FNC_RANDOM
#define FNC_RANDOM
float random(in float x) {
#ifdef RANDOM_SINLESS
    x = fract(x * RANDOM_SCALE.x);
    x *= x + 33.33;
    x *= x + x;
    return fract(x);
#else
    return fract(sin(x) * 43758.5453);
#endif
}

float random(in vec2 st) {
#ifdef RANDOM_SINLESS
    vec3 p3  = fract(vec3(st.xyx) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
#else
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
#endif
}

float random(in vec3 pos) {
#ifdef RANDOM_SINLESS
    pos  = fract(pos * RANDOM_SCALE.xyz);
    pos += dot(pos, pos.zyx + 31.32);
    return fract((pos.x + pos.y) * pos.z);
#else
    return fract(sin(dot(pos.xyz, vec3(70.9898, 78.233, 32.4355))) * 43758.5453123);
#endif
}

float random(in vec4 pos) {
#ifdef RANDOM_SINLESS
    pos = fract(pos * RANDOM_SCALE);
    pos += dot(pos, pos.wzxy + 33.33);
    return fract((pos.x + pos.y) * (pos.z + pos.w));
#else
    float dot_product = dot(pos, vec4(12.9898,78.233,45.164,94.673));
    return fract(sin(dot_product) * 43758.5453);
#endif
}

vec2 random2(float p) {
    vec3 p3 = fract(vec3(p) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec2 random2(vec2 p) {
    vec3 p3 = fract(p.xyx * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec2 random2(vec3 p3) {
    p3 = fract(p3 * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy);
}

vec3 random3(float p) {
    vec3 p3 = fract(vec3(p) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xxy + p3.yzz) * p3.zyx); 
}

vec3 random3(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * RANDOM_SCALE.xyz);
    p3 += dot(p3, p3.yxz + 19.19);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}

vec3 random3(vec3 p) {
    p = fract(p * RANDOM_SCALE.xyz);
    p += dot(p, p.yxz + 19.19);
    return fract((p.xxy + p.yzz) * p.zyx);
}

vec4 random4(float p) {
    vec4 p4 = fract(p * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);   
}

vec4 random4(vec2 p) {
    vec4 p4 = fract(p.xyxy * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

vec4 random4(vec3 p) {
    vec4 p4 = fract(p.xyzx * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}

vec4 random4(vec4 p4) {
    p4 = fract(p4  * RANDOM_SCALE);
    p4 += dot(p4, p4.wzxy + 19.19);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}
#endif
#if !defined(FNC_SATURATE) && !defined(saturate)
#define FNC_SATURATE
#define saturate(V) clamp(V, 0.0, 1.0)
#endif
#ifndef FNC_MAP
#define FNC_MAP
float map(float v, float iMin, float iMax ) { return (v-iMin)/(iMax-iMin); }
vec2 map(vec2 v, vec2 iMin, vec2 iMax ) { return (v-iMin)/(iMax-iMin); }
vec3 map(vec3 v, vec3 iMin, vec3 iMax ) { return (v-iMin)/(iMax-iMin); }
vec4 map(vec4 v, vec4 iMin, vec4 iMax ) { return (v-iMin)/(iMax-iMin); }

float map(in float v, in float iMin, in float iMax, in float oMin, in float oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
vec2 map(in vec2 v, in vec2 iMin, in vec2 iMax, in vec2 oMin, in vec2 oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
vec3 map(in vec3 v, in vec3 iMin, in vec3 iMax, in vec3 oMin, in vec3 oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
vec4 map(in vec4 v, in vec4 iMin, in vec4 iMax, in vec4 oMin, in vec4 oMax) { return oMin + (oMax - oMin) * (v - iMin) / (iMax - iMin); }
#endif
#ifndef EIGHTH_PI
#define EIGHTH_PI 0.39269908169
#endif
#ifndef QTR_PI
#define QTR_PI 0.78539816339
#endif
#ifndef HALF_PI
#define HALF_PI 1.5707963267948966192313216916398
#endif
#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif
#ifndef TAU
#define TAU 6.2831853071795864769252867665590
#endif
#ifndef INV_PI
#define INV_PI 0.31830988618379067153776752674503
#endif
#ifndef INV_SQRT_TAU
#define INV_SQRT_TAU 0.39894228040143267793994605993439  
#endif
#ifndef SQRT_HALF_PI
#define SQRT_HALF_PI 1.25331413732
#endif
#ifndef PHI
#define PHI 1.618033988749894848204586834
#endif
#ifndef EPSILON
#define EPSILON 0.0000001
#endif
#ifndef GOLDEN_RATIO
#define GOLDEN_RATIO 1.6180339887
#endif
#ifndef GOLDEN_RATIO_CONJUGATE 
#define GOLDEN_RATIO_CONJUGATE 0.61803398875
#endif
#ifndef GOLDEN_ANGLE 
#define GOLDEN_ANGLE 2.39996323
#endif
#ifndef DEG2RAD
#define DEG2RAD (PI / 180.0)
#endif
#ifndef RAD2DEG
#define RAD2DEG (180.0 / PI)
#endif

#ifndef FNC_PALETTE
#define FNC_PALETTE
vec3 palette (in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) { return a + b * cos(TAU * ( c * t + d )); }
vec4 palette (in float t, in vec4 a, in vec4 b, in vec4 c, in vec4 d) { return a + b * cos(TAU * ( c * t + d )); }
#endif

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform float uSpeed;
uniform float uOpacity;

vec3 pos2col(vec2 i){
    i+=vec2(9.,0.);

    float r=random(i+vec2(12.,2.));
    float g=random(i+vec2(7.,5.));
    float b=random(i);

    vec3 col=vec3(r,g,b);
    return col;
}

vec3 colorNoise(vec2 uv){
    vec2 size=vec2(1.);
    vec2 pc=uv*size;
    vec2 base=floor(pc);

    vec3 v1=pos2col((base+vec2(0.,0.))/size);
    vec3 v2=pos2col((base+vec2(1.,0.))/size);
    vec3 v3=pos2col((base+vec2(0.,1.))/size);
    vec3 v4=pos2col((base+vec2(1.,1.))/size);

    vec2 f=fract(pc);

    f=smoothstep(0.,1.,f);

    vec3 px1=mix(v1,v2,f.x);
    vec3 px2=mix(v3,v4,f.x);
    vec3 v=mix(px1,px2,f.y);
    return v;
}

void main(){
    vec2 uv=vUv;

    vec3 col=vec3(1.);

    float mask=1.;

    vec2 noiseUv=uv;
    noiseUv.x+=-iTime*.5;
    float noiseValue=noise(noiseUv*vec2(3.,100.));
    mask=noiseValue;
    mask=map(mask,-1.,1.,0.,1.);
    mask=pow(saturate(mask-.1),11.);
    mask=smoothstep(0.,.04,mask);

    
    col=colorNoise(noiseUv*vec2(10.,100.));
    col*=vec3(1.5,1.,400.);
    
    mask*=smoothstep(.02,.5,uv.x)*smoothstep(.02,.5,1.-uv.x);
    mask*=smoothstep(.01,.1,uv.y)*smoothstep(.01,.1,1.-uv.y);
    mask*=smoothstep(1.,10.,uSpeed);

    gl_FragColor=vec4(col,mask*uOpacity);
}`;function d(o){return new URL(Object.assign({"../assets/model/sm_car.gltf":Fe,"../assets/model/sm_car_data.bin":Ue,"../assets/model/sm_car_img0.webp":Ve,"../assets/model/sm_car_img1.webp":Ge,"../assets/model/sm_car_img2.webp":ke,"../assets/model/sm_car_img3.webp":Ze,"../assets/model/sm_car_img4.webp":He,"../assets/model/sm_car_img5.webp":Je,"../assets/model/sm_car_img6.webp":We,"../assets/model/sm_car_img7.webp":Be,"../assets/model/sm_car_img8.webp":Qe,"../assets/model/sm_speedup.gltf":Ye,"../assets/model/sm_speedup_data.bin":Xe,"../assets/model/sm_startroom.raw.gltf":je,"../assets/model/sm_startroom.raw_data.bin":Ke,"../assets/texture/t_car_body_AO.raw.jpg":qe,"../assets/texture/t_env_light.hdr":$e,"../assets/texture/t_env_night.hdr":et,"../assets/texture/t_floor_normal.webp":tt,"../assets/texture/t_floor_roughness.webp":it,"../assets/texture/t_startroom_ao.raw.jpg":nt,"../assets/texture/t_startroom_light.raw.jpg":at})[`../assets/${o}`],import.meta.url).href}class dt{constructor(e){U(this,"sleep",e=>new Promise(t=>setTimeout(t,e)));this.parent=e.parent,this.target=e.target,this.devicePixelRatio=window.devicePixelRatio,this.width=this.target.offsetWidth*this.devicePixelRatio,this.height=this.target.offsetHeight*this.devicePixelRatio,this.callback=e.callback,this.clock=new ne,this.option={scene:{background:new r("black"),fogBackground:10526880,fogNear:.1,fogFar:1e4},camera:{cameraFov:33.4,cameraNear:.1,cameraFar:1e3,x:0,y:.8,z:-11,lookAtX:0,lookAtY:.8,lookAtZ:0},axesHelper:{open:!1,size:150},controls:{open:!0,enablePan:!1,enableZoom:!0,minPolarAngle:0,maxPolarAngle:Math.PI,enableDamping:!0,dampingFactor:.05,autoRotate:!1,atoRotateSpeed:2,setX:0,setY:.8,setZ:0},stats:!0,progressCallback:null,params:{disableInteract:!1,envWeight:0,envIntensity:0,isCameraMoving:!1,lightAlpha:0,lightIntensity:0,reflectIntensity:0,bloomLuminanceSmoothing:1.6,bloomIntensity:1,carBodyEnvIntensity:1,speed:0,speedUpOpacity:0,isRushing:!1,lightOpacity:1,floorLerpColor:0,furinaLerpColor:0,cameraFov:33.4},uj:{iGlobalTime:{value:0},iTime:{value:0},iTimeDelta:{value:0},iResolution:{value:new f(window.innerWidth,window.innerHeight,1)},iMouse:{value:new C(0,0,0,0)},iFrame:{value:0},iDate:{value:new C(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate(),new Date().getHours())},iSampleRate:{value:44100},iChannelTime:{value:[0,0,0,0]}}},this.baseInit(),this.assetsManageInit()}baseInit(){this.renderer=new ae({powerPreference:"high-performance",antialias:!1,stencil:!1,depth:!1,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(this.devicePixelRatio),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(16777215,1),this.renderer.shadowMap.enabled=!0,this.renderer.toneMapping=oe,this.target.appendChild(this.renderer.domElement),this.scene=new se,this.scene.background=new r("black"),this.camera=new G(33.4,this.width/this.height,.1,1e3),this.camera.position.set(0,.8,-11),this.camera.lookAt(0,.8,0),this.camera.updateProjectionMatrix()}assetsManageInit(){this.manager=new re,this.dracoLoader=new le(this.manager),this.dracoLoader.setDecoderPath("./draco/gltf/"),this.textureLoader=new ce(this.manager),this.rgbeLoader1=new k(this.manager).setDataType(S).load(d("texture/t_env_night.hdr")),this.rgbeLoader2=new k(this.manager).setDataType(S).load(d("texture/t_env_light.hdr")),this.textureLoader1=this.textureLoader.load(d("texture/t_startroom_ao.raw.jpg")),this.textureLoader1.channel=1,this.textureLoader1.flipY=!1,this.textureLoader1.colorSpace=L,this.textureLoader2=this.textureLoader.load(d("texture/t_startroom_light.raw.jpg")),this.textureLoader2.channel=1,this.textureLoader2.flipY=!1,this.textureLoader2.colorSpace=pe,this.textureLoader3=this.textureLoader.load(d("texture/t_floor_normal.webp")),this.textureLoader3.flipY=!1,this.textureLoader3.colorSpace=L,this.textureLoader3.wrapS=z,this.textureLoader3.wrapT=z,this.textureLoader4=this.textureLoader.load(d("texture/t_floor_roughness.webp")),this.textureLoader4.flipY=!1,this.textureLoader4.colorSpace=L,this.textureLoader4.wrapS=z,this.textureLoader4.wrapT=z,this.textureLoader5=this.textureLoader.load(d("texture/t_car_body_AO.raw.jpg")),this.textureLoader5.flipY=!1,this.textureLoader5.colorSpace=L,this.textureLoader5.minFilter=D,this.textureLoader5.magFilter=D,this.textureLoader5.channel=1;const e=new N(this.manager).setDRACOLoader(this.dracoLoader);this.startRoomLoader=e.loadAsync(d("model/sm_startroom.raw.gltf"));const t=me(),i=new N(this.manager).setDRACOLoader(this.dracoLoader).setMeshoptDecoder(t);this.carLoader=i.loadAsync(d("model/sm_car.gltf"));const n=new N(this.manager).setDRACOLoader(this.dracoLoader).setMeshoptDecoder(t);this.speedupLoader=n.loadAsync(d("model/sm_speedup.gltf")),this.manager.onLoad=async()=>{console.log("资源加载完成!"),this.callback(),this.FBOInit(),this.QUADInit(),await this.startRoom(),await this.carLoad(),await this.createEnvironment(),await this.speedupLoad(),await this.enter(),this.postEA(),this.option.axesHelper.open&&this.axesHelperInit(),this.option.controls.open&&this.controlsInit(),this.option.stats&&this.statsInit(),this.resize(),this.eventManage(),this.animate()}}eventManage(){this.eventTime=0,this.eventTimer=null,window.addEventListener("mousedown",()=>{this.eventTime=0,this.eventTimer=setInterval(()=>{this.eventTime+=.1},10)}),window.addEventListener("mouseup",e=>{if(clearInterval(this.eventTimer),!(this.eventTime>2)){const t=new _;t.x=e.clientX/window.innerWidth*2-1,t.y=-(e.clientY/window.innerHeight)*2+1;const i=new Ae;i.setFromCamera(t,this.camera);const n=i.intersectObjects(this.scene.children);if(n.length>0){const l=n[0].object;l.dispatchEvent({type:"click",object:l})}}},!1)}getEnvmapFromHDRTexture(e){const t=new fe(this.renderer);t.compileEquirectangularShader();const i=t.fromEquirectangular(e).texture;return t.dispose(),i}FBOInit(){var n;this.envMap1=this.getEnvmapFromHDRTexture(this.rgbeLoader1),this.envMap2=this.getEnvmapFromHDRTexture(this.rgbeLoader2);const e=(n=this.envMap1)==null?void 0:n.source.data,t=e.width||window.innerWidth*window.devicePixelRatio,i=e.height||window.innerHeight*window.devicePixelRatio;this.FBO=new T(t,i,{minFilter:w,magFilter:w,type:S}),this.FBO.texture.mapping=de,this.scene.environment=this.FBO.texture}QUADInit(){this.QUADCamera=new X(-1,1,1,-1,0,1),this.QUADGeometry=new j(2,2,1,1),this.QUADMaterial=new g({vertexShader:lt,fragmentShader:ct,uniforms:{uEnvmap1:{value:this.envMap1},uEnvmap2:{value:this.envMap2},uWeight:{value:0},uIntensity:{value:1}}}),this.QUADMesh=new F(this.QUADGeometry,this.QUADMaterial)}QUADRender(){this.renderer.setRenderTarget(this.FBO),this.renderer.render(this.QUADMesh,this.QUADCamera),this.renderer.setRenderTarget(null)}async startRoom(){const e=await this.startRoomLoader,t=[];e.scene.traverse(n=>t.push(n)),this.light001=t[1];const i=this.light001.material;i.emissive=new r("white"),i.emissiveIntensity=1,i.toneMapped=!1,i.transparent=!0,i.alphaTest=.1,this.lightMat=i,this.reflectFloor=t[2],this.reflectFloor.material=new he,this.reflectFloor.material.aoMap=this.textureLoader1,this.reflectFloor.material.lightMap=this.textureLoader2,this.reflectFloor.material.normalMap=this.textureLoader3,this.reflectFloor.material.roughnessMap=this.textureLoader4,this.reflectFloor.material.envMapIntensity=0,this.reflectFloor.material=new ve({baseMaterial:this.reflectFloor.material,vertexShader:pt,fragmentShader:mt,uniforms:{...this.option.uj,uColor:{value:new r("#ffffff")},uSpeed:{value:this.option.params.speed},uReflectMatrix:{value:new O},uReflectTexture:{value:null},uReflectIntensity:{value:25},uMipmapTextureSize:{value:new _(window.innerWidth,window.innerHeight)},iGlobalTime:{value:0},iTime:{value:0},iTimeDelta:{value:0},iResolution:{value:new f(window.innerWidth,window.innerHeight,1)},iMouse:{value:new C(0,0,0,0)},iFrame:{value:0},iSampleRate:{value:44100},iChannelTime:{value:[0,0,0,0]}}}),this.reflection(),this.reflectFloor.material.uniforms.uReflectMatrix.value=this._reflectMatrix,this.reflectFloor.material.uniforms.uReflectTexture.value=this.mipmapFBO.texture,this.scene.add(e.scene)}reflection(){this.mipMapIgnoreObjects=[this.light001,this.reflectFloor],this._camera=new G,this.reflectPlane=new ge,this._reflectMatrix=new O,this.reflectionTarget=new T(1024,1024,{minFilter:w,magFilter:w,type:Z}),this.reflectionTarget2=new T(this.width,this.height,{minFilter:w,magFilter:w,type:S}),this.mipMapGenerator()}mipMapGenerator(){this.mipmapper=new rt,this.mirrorFBO=this.reflectionTarget,this.mipmapFBO=this.reflectionTarget2}beforeRender(){this.reflectPlane.set(new f(0,1,0),0),this.reflectPlane.applyMatrix4(this.reflectFloor.matrixWorld),this._camera.copy(this.camera);const e=new f(0,0,1).clone().negate(),t=this.camera.getWorldPosition(new f);e.reflect(this.reflectPlane.normal);const i=new f;this.reflectPlane.projectPoint(t,i);const n=i.clone();n.sub(t),n.add(i),this._camera.position.copy(n);const l=new f(0,0,-1);l.applyQuaternion(this.camera.getWorldQuaternion(new H)),l.add(t);const p=new f;this.reflectFloor.getWorldPosition(p),p.sub(l),p.reflect(this.reflectPlane.normal).negate(),p.add(this.reflectFloor.getWorldPosition(new f)),this._camera.up.set(0,1,0),this._camera.applyQuaternion(this.camera.getWorldQuaternion(new H)),this._camera.up.reflect(this.reflectPlane.normal),this._camera.lookAt(p),this._camera.updateMatrixWorld();const m=new O;m.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),m.multiply(this._camera.projectionMatrix),m.multiply(this._camera.matrixWorldInverse),this._reflectMatrix.copy(m),this.reflectPlane.applyMatrix4(this._camera.matrixWorldInverse);const c=new C(this.reflectPlane.normal.x,this.reflectPlane.normal.y,this.reflectPlane.normal.z,this.reflectPlane.constant),a=this._camera.projectionMatrix,s=new C;s.x=(Math.sign(c.x)+a.elements[8])/a.elements[0],s.y=(Math.sign(c.y)+a.elements[9])/a.elements[5],s.z=-1,s.w=(1+a.elements[10])/a.elements[14],c.multiplyScalar(2/c.dot(s)),a.elements[2]=c.x,a.elements[6]=c.y,a.elements[10]=c.z+1,a.elements[14]=c.w;const M=this.renderer.getRenderTarget();this.renderer.setRenderTarget(this.reflectionTarget),this.renderer.state.buffers.depth.setMask(!0),this.renderer.autoClear===!1&&this.renderer.clear(),this.mipMapIgnoreObjects.forEach(A=>A.visible=!1),this.renderer.render(this.scene,this._camera),this.mipMapIgnoreObjects.forEach(A=>A.visible=!0),this.renderer.setRenderTarget(M)}startRoomUpdate(){this.updateUniforms(this.reflectFloor.material.uniforms),this.reflectFloor.material.uniforms.uSpeed.value=this.option.params.speed,this.beforeRender(),this.mipmapper.update(this.mirrorFBO.texture,this.mipmapFBO,this.renderer)}async carLoad(){const e=await this.carLoader,t=[];e.scene.traverse(n=>t.push(n)),e.scene.name="carModel";const i=t[2];this.bodyMat=i.material,this.bodyMat.color=new r("#4a6527"),t.forEach(n=>{if(n.isMesh){const l=n.material;l.aoMap=this.textureLoader5,n.addEventListener("click",()=>{this.rush()})}}),this.bodyMat.envMapIntensity=1,this.carModel=e.scene,this.whellModel=t[35],this.scene.add(this.carModel)}wheelUpdate(){var e;(e=this.whellModel)==null||e.children.forEach(t=>{t.rotateZ(-this.option.params.speed*.03)})}async speedupLoad(){const e=await this.speedupLoader,t=[];e.scene.traverse(n=>t.push(n));const i=t[1];i.material=new g({vertexShader:At,fragmentShader:ft,transparent:!0,depthWrite:!1,uniforms:{...this.option.uj,uSpeed:{value:this.option.params.speed},uOpacity:{value:this.option.params.speedUpOpacity}}}),this.speedMaterial=i.material,this.scene.add(e.scene)}speedUpdate(){this.updateUniforms(this.speedMaterial.uniforms),this.speedMaterial.uniforms.uSpeed.value=this.option.params.speed}updateUniforms(e){const t=this.clock.getElapsedTime();e.iGlobalTime.value=t,e.iTime.value=t;const i=this.clock.getDelta();e.iTimeDelta.value=i,e.iResolution.value=new f(window.innerWidth,window.innerHeight,1),e.iDate.value=new C(new Date().getFullYear(),new Date().getMonth()+1,new Date().getDate(),new Date().getHours()),e.iChannelTime.value=[t,t,t,t],e.iFrame.value+=1}enter(){this.option.params.disableInteract=!0,this.QUADMesh.material.uniforms.uIntensity.value=0,this.QUADMesh.material.uniforms.uWeight.value=0,this.lightMat.emissive=new r("#000000"),this.lightMat.emissiveIntensity=0,this.reflectFloor.material.uniforms.uColor.value.set(new r("#000000")),this.option.params.isCameraMoving=!0;const e=new r,t=new r("#000000"),i=new r("#ffffff");this.t1=h.timeline(),this.t2=h.timeline(),this.t3=h.timeline(),this.t4=h.timeline(),this.t5=h.timeline(),this.t6=h.timeline(),this.t7=h.timeline(),this.t8=h.timeline(),this.t9=h.timeline(),this.t1.to(this.option.camera,{x:0,y:.8,z:-7,duration:4,ease:"power2.inOut",onUpdate:()=>{this.camera.position.set(this.option.camera.x,this.option.camera.y,this.option.camera.z)},onComplete:()=>{this.option.params.isCameraMoving=!1,this.option.params.disableInteract=!1}}),this.t2.to(this.option.params,{lightAlpha:1,lightIntensity:1,reflectIntensity:25,duration:4,delay:1,ease:"power2.inOut",onUpdate:()=>{e.copy(t).lerp(i,this.option.params.lightAlpha),this.lightMat.emissive.set(e),this.lightMat.emissiveIntensity=this.option.params.lightIntensity,this.reflectFloor.material.uniforms.uColor.value.set(e),this.reflectFloor.material.uniforms.uReflectIntensity.value=this.option.params.reflectIntensity}}),this.t3.to(this.option.params,{envIntensity:1,duration:4,delay:.5,ease:"power2.inOut",onUpdate:()=>{this.QUADMesh.material.uniforms.uIntensity.value=this.option.params.envIntensity}}).to(this.option.params,{envWeight:1,duration:4,ease:"power2.inOut",onUpdate:()=>{this.QUADMesh.material.uniforms.uWeight.value=this.option.params.envWeight}},"-=2.5")}clearAllTweens(){this.t1.clear(),this.t2.clear(),this.t3.clear(),this.t4.clear(),this.t5.clear(),this.t6.clear(),this.t7.clear(),this.t8.clear(),this.t9.clear()}createEnvironment(e={}){const{resolution:t=512,near:i=1,far:n=1e3,scene:l=this.scene,options:p={minFilter:ue,anisotropy:0,depthBuffer:!1,generateMipmaps:!0},textureType:m=Z,ignoreObjects:c=[this.carModel]}=e;this.ignoreObjects=c;const a=new Ie(t,p);a.texture.type=m,this.virtualFbo=a;const s=new xe(i,n,a),M=l;this.cubeCamera=s,this.virtualScene=M}environmentUpdate(){this.ignoreObjects.forEach(e=>{e.visible=!1}),this.cubeCamera.update(this.renderer,this.virtualScene),this.ignoreObjects.forEach(e=>{e.visible=!0})}rush(){if(this.option.params.isRushing){this.rushDone();return}if(this.option.params.disableInteract)return;this.option.params.disableInteract=!0,this.clearAllTweens();const e=new r,t=new r("#000000");new r,new r("#666666"),this.t4.to(this.option.params,{speed:4,duration:2,ease:"power2.out",onComplete:()=>{this.option.params.isRushing=!0,this.option.params.disableInteract=!1}}).to(this.option.params,{speed:10,duration:4,ease:"power2.out"}),this.t5.to(this.option.params,{lightOpacity:0,duration:1,ease:"power2.out",onUpdate:()=>{this.lightMat.opacity=this.option.params.lightOpacity}}),this.t6.fromTo(this.option.params,{floorLerpColor:0,furinaLerpColor:0},{floorLerpColor:1,furinaLerpColor:1,duration:4,ease:"none",onUpdate:()=>{e.lerp(t,this.option.params.floorLerpColor),this.reflectFloor.material.uniforms.uColor.value.set(e)}}),this.t7.to(this.option.params,{envIntensity:.01,duration:1,ease:"power2.out",onUpdate:()=>{this.QUADMesh.material.uniforms.uIntensity.value=this.option.params.envIntensity}}),this.t8.to(this.option.params,{speedUpOpacity:1,cameraFov:36,duration:2,ease:"power2.out",onUpdate:()=>{this.speedMaterial.uniforms.uOpacity.value=this.option.params.speedUpOpacity,this.camera.fov=this.option.params.cameraFov,this.camera.updateProjectionMatrix()}}),this.sleep(1e3),this.scene.environment=this.virtualFbo.texture,this.t9.to(this.option.params,{carBodyEnvIntensity:5,cameraShakeIntensity:1,bloomLuminanceSmoothing:.4,bloomIntensity:2,duration:4,ease:"power2.out",onUpdate:()=>{this.bodyMat.envMapIntensity=this.option.params.carBodyEnvIntensity,this.bloom.luminanceMaterial.smoothing=this.option.params.bloomLuminanceSmoothing,this.bloom.intensity=this.option.params.bloomIntensity}})}rushDone(){if(this.option.params.disableInteract)return;console.log("停下来"),this.option.params.disableInteract=!0,this.clearAllTweens();const e=new r,t=new r("#ffffff");this.t4.to(this.option.params,{speed:0,duration:2,ease:"power2.out",onComplete:()=>{this.option.params.isRushing=!1,this.option.params.disableInteract=!1}}),this.t5.to(this.option.params,{lightOpacity:1,duration:1,ease:"power2.out",onUpdate:()=>{this.lightMat.opacity=this.option.params.lightOpacity}}),this.t6.fromTo(this.option.params,{floorLerpColor:0,furinaLerpColor:0},{floorLerpColor:1,furinaLerpColor:1,duration:4,ease:"none",onUpdate:()=>{e.lerp(t,this.option.params.floorLerpColor),this.reflectFloor.material.uniforms.uColor.value.set(e)}}),this.t7.to(this.option.params,{envIntensity:1,duration:1,ease:"power2.out",onUpdate:()=>{this.QUADMesh.material.uniforms.uIntensity.value=this.option.params.envIntensity}}),this.t8.to(this.option.params,{speedUpOpacity:0,cameraFov:33.4,duration:2,ease:"power2.out",onUpdate:()=>{this.speedMaterial.uniforms.uOpacity.value=this.option.params.speedUpOpacity,this.camera.fov=this.option.params.cameraFov,this.camera.updateProjectionMatrix()}}),this.t9.to(this.option.params,{carBodyEnvIntensity:1,cameraShakeIntensity:0,bloomLuminanceSmoothing:1.6,bloomIntensity:1,duration:4,ease:"power2.out",onUpdate:()=>{this.bodyMat.envMapIntensity=this.option.params.carBodyEnvIntensity,this.bloom.luminanceMaterial.smoothing=this.option.params.bloomLuminanceSmoothing,this.bloom.intensity=this.option.params.bloomIntensity}}),this.scene.environment=this.FBO.texture}postEA(){this.composer=new ye(this.renderer,{frameBufferType:S}),this.rederPass=new Se(this.scene,this.camera),this.composer.addPass(this.rederPass),this.bloom=new be({blendFunction:_e.ADD,mipmapBlur:!0,luminanceThreshold:0,luminanceSmoothing:this.option.params.bloomLuminanceSmoothing,bloomIntensity:this.option.params.bloomIntensity}),this.composer.addPass(new Pe(this.camera,this.bloom))}axesHelperInit(){this.axesHelper=new Ce(this.option.axesHelper.size),this.scene.add(this.axesHelper)}statsInit(){this.stats=new we,this.stats.dom.style.position="absolute",this.parent.appendChild(this.stats.dom)}controlsInit(){this.controls=new Me(this.camera,this.renderer.domElement),this.controls.enablePan=this.option.controls.enablePan,this.controls.enableZoom=this.option.controls.enableZoom,this.controls.minPolarAngle=this.option.controls.minPolarAngle,this.controls.maxPolarAngle=this.option.controls.maxPolarAngle,this.controls.enableDamping=this.option.controls.enableDamping,this.controls.dampingFactor=this.option.controls.dampingFactor,this.controls.autoRotate=this.option.controls.autoRotate,this.controls.autoRotateSpeed=this.option.controls.atoRotateSpeed,this.controls.target.set(this.option.controls.setX,this.option.controls.setY,this.option.controls.setZ),this.controls.update()}resize(){window.onresize=()=>{const e=window.innerWidth,t=window.innerHeight;this.camera.updateProjectionMatrix(),this.reflectionTarget.setSize(e,t),this.reflectionTarget2.setSize(e,t),this.reflectFloor.material.uniforms.uMipmapTextureSize.value=new _(e,t),this.camera.aspect=e/t,this.renderer.setSize(e,t),this.composer.setSize(e,t)}}animate(){requestAnimationFrame(()=>this.animate()),this.option.stats&&this.stats.update(),this.option.controls.open&&this.controls.update(),this.option.params.isCameraMoving?this.controls.enabled=!1:this.controls.enabled=!0,this.QUADRender(),this.startRoomUpdate(),this.wheelUpdate(),this.speedUpdate(),this.environmentUpdate(),this.composer.render(this.scene,this.camera)}destroy(){this.scene.traverse(e=>{var t;e instanceof F&&((t=e.geometry)==null||t.dispose(),Object.values(e.material).forEach(i=>{i&&typeof i.dispose=="function"&&i.dispose()}))}),this.composer.dispose(),this.renderer.dispose()}}const ht={class:"su7"},vt={class:"load"},gt={__name:"index",setup(o){const e=J(!1);J(0);let t=null;const i=n=>{e.value=!0};return Le(()=>{t=new dt({parent:document.querySelector(".su7"),target:document.querySelector(".canvas"),callback:i})}),ze(()=>{t.destroy(),t=null,console.info("%csu7-销毁😁","color:#fff;background-color:red")}),(n,l)=>(W(),B("div",ht,[E("div",{class:Ne(["loading",{loadOk:e.value}])},[E("div",vt,[(W(),B(Ee,null,Te("LOADING...",(p,m)=>E("span",{key:m,style:De("--i:"+m)},Re(p),5)),64))])],2),l[0]||(l[0]=E("div",{class:"canvas"},null,-1))]))}},yt=Oe(gt,[["__scopeId","data-v-45a85a29"]]);export{yt as default};
