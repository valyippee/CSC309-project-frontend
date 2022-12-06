import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../api/AuthContext";
import "./SubscriptionsPage.css";
import Title from "../components/Title";
import { getSubscriptions, getUserSubscription } from "../api/requests";
import Subscription from "../components/subscriptions/Subscription";
import { getSubscriptionStatusCodes } from "../utils/utils";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);

  let { token } = useContext(AuthContext);

  useEffect(() => {
    getSubscriptions(setSubscriptions);
    getUserSubscription(setUserSubscription, token);
  }, []);

  return (
    <>
      <Title title={"Subscriptions"} />
      <div className="subscriptions-page-body-container">
        {userSubscription === null
          ? subscriptions.map((subscription) => (
              <Subscription
                subscription={subscription}
                status={getSubscriptionStatusCodes()["SUBSCRIBE"]}
              />
            ))
          : subscriptions.map((subscription) => (
              <Subscription 
                subscription={subscription}
                status={subscription.id === userSubscription.id ? getSubscriptionStatusCodes()["CANCEL"] : getSubscriptionStatusCodes()["CHANGE"]}
              />
            ))}
      </div>
    </>
  );
};

export default SubscriptionsPage;
