

    PSUEDOCODE Setup
        •Purpose:  Defines the entery point of code, and what needs to be initalized and general functions.
        • Initalize and store all global variables needed
            ○ CSS function that controls and fetches the degree variable (--degree)
                — Make a fetch function
                    - Should fetch the current value of the "--degree" css variable
                — Make a set function
                    - Should set the current value of the "--degree" css variable
                
            ○ All the major DOM elements that is needed, store as needed  
                — Timer input elements 
                    - An array of input tags
                — Finish timer element 
                    - as a div tag
                — Contorl buttons 
                    The mentioned as an array of divs:
                        - Play 
                        - Pause 
                        - Reset 

            ○ Initalize a "Timer" class
                — constructor function
                    - initalize int variable called "progress" that has the states
                        null, if the timer is not currenlty running or has been started
                        0, if timer has been started but, currently paused
                        1, if timer is running
                        default should be null upon cunstruction

                    - Initalize a variable called "timer"
                        This variable will serve as a way to interact with the setInterval function, 
                        upon construction set to null
                    - Initlize variable called Fn; the function for the timer
                    - Initilize variable called tickRate; how often the setInterval should be called
                
                — Method to set state of "progress"
                    - takes arguement that is  null or an integer
                    - Sets the state of the progress to the givevn value
                    - Call display function
                    - Set readonly function

                — Method to get value of "progress"
                    - simply fetches the current value of progress and returns it

                — play method 
                    - using CSS set method, set the --degree variable to 0deg if the method that gets "progress" returns null
                    - set the timer variable to the setInterval function passing along the input parametes as arguemetns to the setINterval (function, tickrate)
                    - Using the set method set the value of "progress" to 1
                    - call FinishTimer so that the finishes at element is updated

                — Pause method 
                    - Clear the timer interval  using the clear interval method
                    - set timer variable to null
                    - using the set method, set the value of "progress" to 0
                
                — Reset method 
                    - Clear the timer interval
                    - Set timer variable to null 
                    - Using set method, set the "progress" value to null

    PSEUDOCODE Display 
        • Purpose: To manage display states of control buttons and finishes at reminder 
        • Function : set display states 
            — Use the fetch method from the "Timer" class to get current state of timer
                - null (Timer has not been started or is restarted)
                    hidden: Finish time, reset, and pause
                    Visible: Play button
                    action: using the setMethod for the css variable, set the --degree to 360 degrees
                - 0 (Timer is pasued)
                    hidden: pause button, 
                    Visible: Reset, play   
                - 1 (timer is running)
                    Hidden: Play
                    Visible: Pause, and reset
            
            —  run once by default and is triggred when any method in Timer is called 

    PSEUDOCODE leading Zeros 
        • Purpose: To take an array containting hours, minutes, and seconds and convert them from intergers to strings, and adds leading zeros if needed
        • Function: leading_zeros
        •Parameter: A array containg 3 intergers
        •Steps
            — loop through the given array
                - check if the digit is between 0 and 9
                - Yes
                    replace the current value in the arry with the number as a string with a leading zero
                - No
                    Typecast current value to a string
                - return array

    PSUEDOCODE OVERFLOW 
        • Purpose: To ensure the values in the input tags, are in check with the maximum values allowed for said tag
        • Function: Overflow
        • parameter: optional parameter, called total_time set to null 
        • Steps
            — set "total time" to the total time in seconds of all the tags added up if it was null by default.
            — Initalize an array that has 3 slots nammed  "hours_minutes_seconds" 

            — Check if the total time Excceds 359999 (99 hours, 59 miuntes, and 59 seconds)
                - If it does, set the 3 spots in "hours_miuntes_seconds" to "99,59,59" 
                - return "hours_minutes_seconds"

            — Loop through array
                - Set "hours_minutes_seconds" at the current index to  floor division of total time by the 60 to the power of the current index (which should start from 2 and go to 0)          
                - set total time to, total time - ("hours_minutes_seconds" at the current index * (60 raised to the current index))
            — Take the array and pass it to the leading_zero function
            — Return the "hours_minutes_seconds" after it has been formated


    PSEUDOCODE FinishTimer

        • Purpose: To update the finish timer div to show the estimated time of finish of the timer
        • Function updateFinishTime
        • Steps
            ○ make a variale "currentTimeInSeconds" that gets the current time as an array that contains
                — Hour
                — Minute
                — Second
                — Reduce all the values and store it as a number 
                    - The number represents the current time as seconds
            ○ Make another variable "current_timer_value" and add up all the tags value in seconds
            ○ make a another variable that stores the finishTimeinSeconds ("currentTimeInSeconds" + "current_timer_value") and % 86400 to ensure it stays within the 24 hours
            ○ invoke the overflow function with finishTimeInseconds as the arguement, and store it in a result variable
            ○ format the result in the form of "hr:min" and update to the finish timer element
            ○ This function is triggered when the play method in the Timer class is called


    PSEUDOCODE readState
        • Purpose:  set the readyonly state based on "progress" variable
        • Function: setReadOnly
        • Purpose: to set the input tags readonly state
        • Steps  
            — construct a variable called timer state and using the Timer's getState method, get the current timer state
                — Based on the value 
                    - null
                        readonly is false
                    - false or true
                        set readonly to true 
                — Triggered when any control method in Timer is called
            
    PSEUDOCODE event listners
    
        • Start button
            — call the timer's play method
        • Reset button
            — Call the timer's reset method
        • Pause button
            — Call the timer's pause method
        • Focus out
            — Set placeholder values to values
            — Call overflow
        • Focus
            — Set inputs elments, to placeholder values



    PSUEDICIDE updateProgressBar
        we know that left over time is  simply the time on the