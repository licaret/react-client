import "./App.css";
import { useEffect, useState } from "react";
import {
  Card,
  Spin,
  Form,
  Button,
  Input,
  InputNumber,
  Slider,
  Row,
  Col,
} from "antd";

const { Meta } = Card;

const imageNotFoundUrl =
  "https://commercial.bunn.com/img/image-not-available.png";
const MIN_VALUE = 0;
const MAX_VALUE = 20000;

function App() {
  const [data, setData] = useState([]);
  const [minLimit, setMinLimit] = useState(MIN_VALUE);
  const [maxLimit, setMaxLimit] = useState(MAX_VALUE);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    (async () => {
      const token = await localStorage.getItem("authToken");
      const data = await fetch(
        `http://localhost:3000/items?priceMin=${minLimit}&priceMax=${maxLimit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await data.json();

      if (result.status === "error") {
        await localStorage.removeItem("authToken");
        setIsLogged(false);
      } else {
        setData(result);
      }
    })();
  }, [minLimit, maxLimit, isLogged]);

  const onFinish = async (newProductData) => {
    const token = await localStorage.getItem("authToken");
    const response = await fetch("http://localhost:3000/items", {
      method: "POST",
      body: JSON.stringify(newProductData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.text();
    setData([...data, result]);
  };

  const onChangeSlider = (limits) => {
    setMinLimit(limits[0]);
    setMaxLimit(limits[1]);
  };

  const login = async (data) => {
    await localStorage.setItem("authToken", data.token);
    setIsLogged(true);
  };

  const logout = async () => {
    await localStorage.removeItem("authToken");
    setIsLogged(false);
  };

  if (!isLogged) {
    return (
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: false,
        }}
        onFinish={login}
        onFinishFailed={() => alert("Finish Failed")}
        autoComplete="off"
      >
        <Form.Item
          label="Token"
          name="token"
          rules={[
            {
              required: true,
              message: "Please add auth token!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    );
  }

  return (
    <>
      <h1>React + Node.js</h1>

      <Slider
        range
        min={MIN_VALUE}
        max={MAX_VALUE}
        defaultValue={[MIN_VALUE, MAX_VALUE]}
        step={50}
        onChange={onChangeSlider}
      />

      <Row gutter={16}>
        {data.length === 0 ? (
          <Spin size="large" />
        ) : (
          data?.map((item, index) => (
            <Col className="gutter-row" span={6} key={index}>
              <Card
                hoverable
                style={{
                  width: 240,
                }}
                cover={
                  <img alt="example" src={item.imageLink ?? imageNotFoundUrl} />
                }
              >
                <Meta title={item.name} description={item.description} />
                <p>{item.price} RON</p>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: false,
        }}
        onFinish={onFinish}
        onFinishFailed={() => alert("Finish Failed")}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input product name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Image Link"
          name="imageLink"
          rules={[
            {
              type: "url",
              warningOnly: true,
            },
            {
              type: "string",
              min: 6,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input product name!",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Button htmlType="submit" onClick={logout}>
        Logout
      </Button>
    </>
  );
}

export default App;
