import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { useSpring, animated } from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import { store } from './redux/store';
import { actions } from './redux/actions';

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFFDE"
  },
  paper: {
    maxWidth: "600px",
    border: "2px solid #31E89F",
    backgroundColor: "#121212",
    padding: theme.spacing(2, 2, 2, 2),
    outline: "none",
    borderRadius: "10px",
    fontFamily: "Source Sans Pro",
  }
}));

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0, outline: "none" },
    onStart: () => {
      if (open && onEnter) {
        console.log("entering");
        onEnter();
      }
    },
    onRest: () => {
      if (!open && onExited) {
        console.log("exiting");
        onExited();
      }
    }
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {children}
    </animated.div>
  );
});

export default function SpringModal(props) {
  console.log("props spring modal ", props);
  let { modalState } = props;
  console.log("modalState ", modalState);
  const {
    modalOpen,
    modalTitle,
    modalDescription,
    modalDetails,
    modalLocation,
    modalStart,
    modalEnd,
    modalImg
  } = modalState;
  console.log("modal open", modalOpen);
  const classes = useStyles();

  const handleOpen = () => {
    modalState = {...modalState, modalOpen: true};
    store.dispatch(actions.showAboutMeModal(modalState));
  };

  const handleClose = () => {
    modalState = { ...modalState, modalOpen: false };
    store.dispatch(actions.showAboutMeModal(modalState));
  };

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={modalOpen}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={modalOpen}>
          <div className={classes.paper}>
            <div className="modalHeader" style={{ marginBottom: "20px" }}>
              <div
                className="leftContainer"
                style={{ display: "inline-block" }}
              >
                <h2 id="spring-modal-title" style={{ marginBottom: "10px" }}>
                  {modalTitle}
                </h2>
                <p
                  id="spring-modal-description"
                  style={{ marginBottom: "10px" }}
                >
                  {modalLocation}
                </p>
                <p id="spring-modal-description">
                  {modalStart}&nbsp; - &nbsp;{modalEnd}
                </p>
              </div>
              <div
                className="rightContainer"
                style={{
                  float: "right",
                  display: "inline-block"
                }}
              >
                <img src={modalImg} alt="Smiley face" height="100" />
              </div>
            </div>
            <div className="modalTextWrapper">
              <p id="spring-modal-description" style={{ marginBottom: "10px" }}>
                {modalDescription}
              </p>
              <p id="spring-modal-description">{modalDetails}</p>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
