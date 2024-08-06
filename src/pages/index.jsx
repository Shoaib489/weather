import Temperature from '@/components/temperature'
import React from 'react'
import RainAnimation from './boxData'
import classes from "../pages/boxData/style.module.css"

const index = () => {
  return (
    // <div className={classes.mainBackG}>
      <div className={classes.shadow}>
        {/* <RainAnimation /> */}
        <Temperature />
      </div>
    // </div>
  )
}

export default index