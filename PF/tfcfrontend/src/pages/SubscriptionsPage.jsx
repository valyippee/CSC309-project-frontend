import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../api/AuthContext";
import "./SubscriptionsPage.css";
import Title from "../components/Title";
import { getSubscriptions, getUserSubscription } from "../api/requests";
import Subscription from "../components/subscriptions/Subscription";
import { getSubscriptionStatusCodes } from "../utils/utils";
import NoticeModal from "../components/NoticeModal";
import { useNavigate } from "react-router-dom";

const SubscriptionsPage = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const navigate = useNavigate();

  let { token } = useContext(AuthContext);

  useEffect(() => {
    getSubscriptions(setSubscriptions);
    getUserSubscription(setUserSubscription, token);
  }, []);

  const navigateToLoginPage = () => {
    navigate("/login/");
  };

  const reloadPage = () => {
    setUserSubscription(null)
    getSubscriptions(setSubscriptions);
    getUserSubscription(setUserSubscription, token);
    setDisplayModal(false);
    setSuccessInfo(null);
    setErrorInfo(null);
  }

  const modalOnHide = () => {
    setDisplayModal(false);
  };

  useEffect(() => {
    if (successInfo) {
      if (successInfo.success_code === 0) { // USER SUBSCRIBED
        setModalInfo({
            title: "Subscribed Successfully",
            message: "You have successfully subscribed to the " + successInfo.subscription.name + " plan. You can now enrol in classes.",
            buttonText: "Continue",
            onConfirm: reloadPage,
            onHide: reloadPage,
        });
      } else if (successInfo.success_code === 1) { // USER CHANGED SUBSCRIPTION PLAN
        setModalInfo({
            title: "Subscription Plan Changed Successfully",
            message: "You have successfully changed your subscription plan to the " + successInfo.subscription.name + " plan.",
            buttonText: "Continue",
            onConfirm: reloadPage,
            onHide: reloadPage,
        });
      } else if (successInfo.success_code === 2) {
        setModalInfo({
            title: "Successfully Cancelled Subscription Plan",
            message: "You have successfully cancelled your subscription plan",
            buttonText: "Continue",
            onConfirm: reloadPage,
            onHide: reloadPage,
        });
      }
      setDisplayModal(true);
    }
  }, [successInfo]);

  useEffect(() => {
    if (errorInfo) {
      if (errorInfo.error_code === 0) {
        setModalInfo({
          title: "Unable to Subscribe to Plan",
          message: "In order to subscribe to a plan, you need to be logged in.",
          buttonText: "Log In",
          onConfirm: navigateToLoginPage,
          onHide: modalOnHide,
          showCancelButton: true
        });
        setDisplayModal(true);
      }
    }
  }, [errorInfo]);

  return (
    <>
      <Title title={"Subscriptions"} />
      <div className="subscriptions-page-body-container">
        {userSubscription === null
          ? subscriptions.map((subscription) => (
              <Subscription
                subscription={subscription}
                status={getSubscriptionStatusCodes()["SUBSCRIBE"]}
                setSuccessInfo={setSuccessInfo}
                setErrorInfo={setErrorInfo}
              />
            ))
          : subscriptions.map((subscription) => (
              <Subscription
                key={subscription.id}
                subscription={subscription}
                status={
                  subscription.id === userSubscription.id
                    ? getSubscriptionStatusCodes()["CANCEL"]
                    : getSubscriptionStatusCodes()["CHANGE"]
                }
                setSuccessInfo={setSuccessInfo}
                setErrorInfo={setErrorInfo}
              />
            ))}
      </div>
      {displayModal && (
        <NoticeModal
          showModal={displayModal}
          title={modalInfo.title}
          message={modalInfo.message}
          buttonText={modalInfo.buttonText}
          onConfirm={modalInfo.onConfirm}
          onHide={modalInfo.onHide}
        />
      )}
    </>
  );
};

export default SubscriptionsPage;
