import { useEffect, useState } from "react";

type ChatSrcollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;

};

export const useChatScroll = ({
    chatRef,
    bottomRef,
    shouldLoadMore,
    loadMore,
    count,
}: ChatSrcollProps) => {
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        const topDIv = chatRef?.current;

        const handleScroll = () => {
            const scrollTop = topDIv?.scrollTop;
            if (scrollTop === 0 && shouldLoadMore) {
                loadMore();
            }
        }
        topDIv?.addEventListener("scroll", handleScroll);
        return () => {
            topDIv?.removeEventListener("scroll", handleScroll);
        }
    }, [shouldLoadMore, loadMore, chatRef])

    useEffect(() => {
        const bottomDiv = bottomRef?.current;
        const topDIv = chatRef?.current;

        const shouldAutoScroll = () => {
            if (!hasInitialized && bottomDiv) {
                setHasInitialized(true);
                return true;
            }
            if (!topDIv) return false;

            const distanceFromBottom = topDIv.scrollHeight - topDIv.scrollTop - topDIv.clientHeight;
            return distanceFromBottom <= 100;
        }
        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomRef?.current?.scrollIntoView({ behavior: "smooth" })
            }, 100);
        }
    }, [bottomRef, chatRef, count, hasInitialized])

}