export const middleScreenLoading = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
}

export const buttonThemeSubmit = {
    width: "25vw",
    bgcolor: "rgba(74, 182, 236, 1)",
    borderRadius: "0.5vw",
    border: "0.15vw solid black",
    marginBottom: "3vw",
    marginTop: "2vw"
};

export const buttonThemeBlue = {
    bgcolor: "rgba(74, 182, 236, 1)",
    borderRadius: "0.5vw",
    border: "0.15vw solid black",
}

export const buttonThemeDelete = {
    bgcolor: "rgba(236, 74, 74, 1)",
    borderRadius: "0.5vw",
    border: "0.15vw solid black",
}

export const buttonThemeDisabled = {
    bgcolor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    borderRadius: "0.5vw",
    border: "0.15vw solid black",
}

export const buttonThemeKick = {
    bgcolor: "rgba(236, 74, 74, 1)",
}

export const arrayTextBox = {
    bgcolor: "rgba(0, 0, 0, 0.25)",
    border: "0.15vw solid black",
    borderRadius: "0.5vw",
    padding: "0.5vw",
}

export const teamMemberBox = {
    display: "flex",
    justifyContent: "center",
    minWidth: "5vw",
    backgroundColor: "rgba(63, 66, 74, 1)",
    borderRadius: "0.5vw",
    border: "0.15vw solid black",
    padding: "0.5vw",
    marginRight: "0.5vw",
    marginBottom: "0.5vw"
}

export const defaultBarStyled = {
    height: "0.20vw",
    bgcolor: "rgba(255, 255, 255, 0.5)",
    border: "0.15vw solid black",
}

export const borderText = {
    textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black"
}

export const centeredGridText = {
    display: "flex",
    justifyContent: "center",
}

export const accountBox = {
    backgroundColor: "rgba(63, 66, 74, 1)",
    padding: "1vw",
    borderRadius: "1vw",
    border: "0.15vw solid black",
    marginBottom: "1.5vw"
}

export const accountBoxIcon = {
    border: "0.1vw solid black",
    color: "black",
    bgcolor: "rgba(74, 182, 236, 1)",
    padding: "0.5vw",
    borderRadius: "2vw"
}

export const normalStyledButton = {
    width: "10vw",
    bgcolor: "rgba(74, 182, 236, 1)",
    borderRadius: "5vw",
    border: "0.15vw solid black",
    color: "white"
}

// all forum styles
export const styledTextField = {
    margin: "0.5vw",
    width: '25vw',
    borderRadius: "0.5vw",
    input: { color: "rgba(255, 255, 255, 0.5)" },
    bgcolor: "rgba(41, 43, 49, 1)",

    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
    '& .MuiSelect-select': {
        color: "rgba(255, 255, 255, 0.5)"
    },
    '& .MuiFormLabel-root': {
        color: "rgba(255, 255, 255, 0.25)"
    },
    '&:hover .MuiFormLabel-root': {
        color: "rgba(255, 255, 255, 0.5)"
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.25)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
};

export const styledTitle = {
    color: "white",
    borderTopLeftRadius: "0.5vw",
    borderTopRightRadius: "0.5vw",
    borderBottom: "0.15vw solid black",
    backgroundColor: "rgba(74, 182, 236, 1)",
    width: "36vw",
    paddingY: "0.5vw",
};

export const textfieldAdornmentStyle = {
    fontSize: "2vw",
    paddingRight: "0.5vw",
    borderRadius: "0.5vw"
}

export const multiselectTextStyle = {
    color: "rgba(255, 255, 255)",
    backgroundColor: "rgba(74, 182, 236, 1)",
}

// all competition styles
export const competitionPicture = {
    borderTopLeftRadius: "0.5vw",
    borderTopRightRadius: "0.5vw",
    borderTop: "0.15vw solid black",
    borderLeft: "0.15vw solid black",
    borderRight: "0.15vw solid black",
}

export const competitionInfoBox = {
    borderBottomLeftRadius: "0.5vw",
    borderBottomRightRadius: "0.5vw",
    border: "0.15vw solid black",
}

export const styledSelectFieldSmall = {
    margin: "0.5vw",
    borderRadius: "0.5vw",
    input: { color: "rgba(255, 255, 255, 0.5)" },
    bgcolor: "rgba(41, 43, 49, 1)",

    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
    '& .MuiSelect-select': {
        color: "rgba(255, 255, 255, 0.5)"
    },
    '& .MuiFormLabel-root': {
        color: "rgba(255, 255, 255, 0.25)"
    },
    '&:hover .MuiFormLabel-root': {
        color: "rgba(255, 255, 255, 0.5)"
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.25)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
};

export const fixedFilterPosition = {
    // top: "0",
    // bottom: "0",
    position: "fixed",
}

// all CompetitionCreate styles
export const styledMultilineTextField = {
    margin: "0.5vw",
    width: '25vw',
    borderRadius: "0.5vw",
    bgcolor: "rgba(41, 43, 49, 1)",

    '& label.Mui-focused': {
        color: 'white',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'white',
    },
    '& .MuiSelect-select': {
        color: "rgba(255, 255, 255, 0.5)"
    },
    '& .MuiInputBase-input': {
        color: "rgba(255, 255, 255, 0.5)",
    },
    '& .MuiFormLabel-root': {
        color: "rgba(255, 255, 255, 0.25)"
    },
    '&:hover .MuiFormLabel-root': {
        color: "rgba(255, 255, 255, 0.5)"
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.25)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
};

// all competition info styles
export const fullCompetitionPicture = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "0.5vw",
    border: "0.15vw solid black",
    width: "65.3vw",
    height: "15vw"
}

export const competitionInfoPageBox = {
    backgroundColor: "rgba(63, 66, 74, 1)",
    borderRadius: "0.5vw",
    border: "0.15vw solid black",
}

export const competitionInfoArrayBox = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    minHeight: "3vw",
    maxHeight: "10vw",
    overflow: "auto",
    marginBottom: "1vw",

    bgcolor: "rgba(0, 0, 0, 0.25)",
    border: "0.15vw solid black",
    borderRadius: "0.5vw",
    padding: "0.5vw"
}