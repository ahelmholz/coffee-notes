import React from "react";
import { useRouter } from "next/router";
import { Flex, Spinner, Text } from "@chakra-ui/core";
import useSWR from "swr";

const UserProfilePage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/.netlify/functions/coffeeNotes", fetcher);
  if (error) return <Text>Something went wrong please try again</Text>;
  if (!data) return <Spinner />;
  console.log(data);
  return <Flex>{data.map((x) => x.roaster)}</Flex>;
};

export default UserProfilePage;
