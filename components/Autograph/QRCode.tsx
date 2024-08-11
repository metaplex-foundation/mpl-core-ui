import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, Text, Button, Group, Stack } from '@mantine/core';
import { IconShare } from '@tabler/icons-react';

const QRCodeComponent = () => {
    const [currentURL, setCurrentURL] = useState('');

    useEffect(() => {
        setCurrentURL(window.location.href);
    }, []);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Share this page',
                    url: currentURL,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            alert('Web Share API is not supported in your browser.');
        }
    };

    return (
        <Card shadow="sm" padding="lg" radius="md">
            <Card.Section>
                <Text fw={500} ta="center" mt="md" size="lg">
                    Share this page
                </Text>
            </Card.Section>

            <Stack align="center" mt="md">
                <QRCodeSVG value={currentURL} size={300} />
            </Stack>

            <Group justify="center" mt="md">
                <Button leftSection={<IconShare size={14} />} onClick={handleShare}>
                    Share
                </Button>
            </Group>
        </Card>
    );
};

export default QRCodeComponent;
