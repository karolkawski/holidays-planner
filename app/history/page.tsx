import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import ListWrapper from "../src/ListWrapper";

export default function History() {
  return (
    <main className="flex flex-col w-full">
      <div className="min-h-screen">
        <Card className="m-10 p-3 bg-gray-800">
          <CardHeader>Files raw data</CardHeader>
          <Divider />
          <CardBody>
            <ListWrapper />
          </CardBody>
          <Divider />
          <CardFooter></CardFooter>
        </Card>
      </div>
    </main>
  );
}
