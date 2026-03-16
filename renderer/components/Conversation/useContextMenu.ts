import { MENU_IDS, CONVERSATION_LIST_MENU_IDS } from "@common/constants";
import useConversationStore from "@renderer/store/useConversationStore";
import { createContextMenu } from "@renderer/utils/contextMenu";

const SortByIdMap = new Map([
  ["createAt", CONVERSATION_LIST_MENU_IDS.SORT_BY_CREATE_TIME],
  ["updatedAt", CONVERSATION_LIST_MENU_IDS.SORT_BY_UPDATE_TIME],
  ["name", CONVERSATION_LIST_MENU_IDS.SORT_BY_NAME],
  ["model", CONVERSATION_LIST_MENU_IDS.SORT_BY_MODEL],
]);
const SortOrderIdMap = new Map([
  ["desc", CONVERSATION_LIST_MENU_IDS.SORT_DESCENDING],
  ["asc", CONVERSATION_LIST_MENU_IDS.SORT_ASCENDING],
]);

export function useContextMenu() {
  const navigate = useNavigate();
  // const route = useRoute();
  const sortBy = useConversationStore((state) => state.sortBy);
  const sortOrder = useConversationStore((state) => state.sortOrder);
  const setSortMode = useConversationStore((state) => state.setSortMode);
  // const [isBatchOperate, setIsBatchOperate] = useState(false);

  const actionPolicy = new Map([
    [
      CONVERSATION_LIST_MENU_IDS.BATCH_OPERATIONS,
      () => {
        // setIsBatchOperate(!isBatchOperate);
      },
    ],
    [
      CONVERSATION_LIST_MENU_IDS.NEW_CONVERSATION,
      () => {
        console.log("new conversation");
        navigate("/conversation");
      },
    ],
    [
      CONVERSATION_LIST_MENU_IDS.SORT_BY_CREATE_TIME,
      () => setSortMode("createAt", sortOrder),
    ],
    [
      CONVERSATION_LIST_MENU_IDS.SORT_BY_UPDATE_TIME,
      () => setSortMode("updatedAt", sortOrder),
    ],
    [
      CONVERSATION_LIST_MENU_IDS.SORT_BY_NAME,
      () => setSortMode("name", sortOrder),
    ],
    [
      CONVERSATION_LIST_MENU_IDS.SORT_BY_MODEL,
      () => setSortMode("model", sortOrder),
    ],
    [
      CONVERSATION_LIST_MENU_IDS.SORT_DESCENDING,
      () => setSortMode(sortBy, "desc"),
    ],
    [
      CONVERSATION_LIST_MENU_IDS.SORT_ASCENDING,
      () => setSortMode(sortBy, "asc"),
    ],
  ]);

  const handle = async () => {
    // const { sortBy, sortOrder } = sortMode;

    // const sortById = SortByIdMap.get(sortBy) ?? "";
    // const sortOrderId = SortOrderIdMap.get(sortOrder) ?? "";
    // const newConversationEnabled = !!route.params.id;

    const item = await createContextMenu(
      MENU_IDS.CONVERSATION_LIST,
      void 0,
      // [
      //   {
      //     id: CONVERSATION_LIST_MENU_IDS.NEW_CONVERSATION,
      //     enabled: newConversationEnabled,
      //   },
      //   { id: sortById, checked: true },
      //   { id: sortOrderId, checked: true },
      // ]
    );

    const action = actionPolicy.get(item as CONVERSATION_LIST_MENU_IDS);
    action?.();
  };

  return {
    handle,
    // isBatchOperate,
  };
}
