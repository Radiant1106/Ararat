import { Button, Flex, List, Modal, Stepper, useMantineTheme, Text, TextInput, Code, LoadingOverlay, Progress, Center, Loader } from "@mantine/core";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CreateNode() {
    const [creatingNode, setCreatingNode] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [audio, setAudio] = useState(null);
    const theme = useMantineTheme();

    const [nodeName, setNodeName] = useState("");
    const [nodeDomain, setNodeDomain] = useState("");
    const [currentStatus, setCurrentStatus] = useState("");
    const [currentPercent, setCurrentPercent] = useState(0);
    const [currentImage, setCurrentImage] = useState("")
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        if (creatingNode) {
            let aud = new Audio("/audio/createNode.m4a")
            aud.volume = 0.60;
            aud.play()
            aud.loop = true;
            setAudio(aud);
        } else {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }, [creatingNode])

    useEffect(() => {
        console.log(activeStep);
        if (activeStep == 2) {
            let socket = new WebSocket("ws://192.168.1.133:3001/install");
            socket.onopen = () => setConnected(true);
            socket.onmessage = (e) => {
                let data = JSON.parse(e.data);
                console.log(data)
                setCurrentStatus(data.status);
                setCurrentPercent(data.percent);
                setCurrentImage(data.image);
            }
        }
    }, [activeStep])
    return (
        <>
            <Button onClick={() => setCreatingNode(true)} my="auto" ml="auto">Create Node</Button>
            <Modal size="xl" overlayProps={{
                color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
                opacity: 0.55,
                blur: 3,
            }} opened={creatingNode} onClose={() => setCreatingNode(false)} title="Create Node" centered>
                <Stepper active={activeStep} breakpoint="sm">
                    <Stepper.Step label="Node Information">
                        <TextInput
                            value={nodeName}
                            onChange={(e) => setNodeName(e.currentTarget.value)}
                            placeholder="us-dal-1"
                            label="Node Name"
                            withAsterisk
                        />
                        <TextInput
                            value={nodeDomain}
                            onChange={(e) => setNodeDomain(e.currentTarget.value)}
                            placeholder="us-dal-1.hye.gg"
                            label="Node Domain"
                            withAsterisk
                        />
                    </Stepper.Step>
                    <Stepper.Step label="Install Dependencies">
                        <List type="ordered">
                            <List.Item>Install snap using these <Link target="_blank" href="https://snapcraft.io/docs/installing-snapd">instructions</Link></List.Item>
                            <List.Item>Install NGINX using these <Link target="_blank" href="https://www.nginx.com/resources/wiki/start/topics/tutorials/install/">instructions</Link></List.Item> 
                            <List.Item>Run the following automatic setup command <Code>snap install lxd</Code></List.Item>
                            <List.Item>Press next when prompted</List.Item>
                        </List>
                    </Stepper.Step>
                    <Stepper.Step label="Hye Lava Setup">
                        <Center mt="lg">
                        <img src={currentImage} width="75px" style={{marginRight: "auto", marginLeft: "auto"}} />
                        </Center>
                        <Text ta="center" mt="xs">{currentStatus}</Text>
                        {connected ? 
                        <Progress label={`${currentPercent}%`} size="xl" mr="auto" ml="auto" mt="xs" value={currentPercent} sx={{maxWidth: "30%"}} />            
                        : 
                            <>
                        <Center>
                            <Loader mr="auto" ml="auto" />
                        </Center>
                        <Text ta="center" mt={"xs"}>Connecting...</Text>
                        </>}
                    </Stepper.Step>
                    <Stepper.Completed>
                        <p>done</p>
                    </Stepper.Completed>
                </Stepper>
                <Flex mt="md">
                    <Button disabled={activeStep == 0 || activeStep == 2} color="red" mr="sm" ml="auto" onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
                    <Button disabled={activeStep == 2} onClick={() => setActiveStep(activeStep + 1)}>Next</Button>
                </Flex>
            </Modal>        </>
    )

}