import React, { useEffect, useState } from "react";
import "./SubscriptionsPage.css";
import Title from "../components/Title";
import { getSubscriptionPlans } from "../api/requests";
import Subscription from "../components/subscriptions/Subscription";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getSubscriptionPlans(setSubscriptions);
  }, []);

  return (
    <>
      <Title title={"Subscriptions"} />
      <div className="subscriptions-page-body-container">
        {subscriptions.map((subscription) => (
          <Subscription subscription={subscription} />
        ))}
      </div>
    </>
  );
};

export default SubscriptionsPage;
