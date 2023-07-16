
  import { useRouter } from "next/navigation";
  import React from "react";
  import { useEffect, useState } from "react";
  import Tab from 'react-bootstrap/Tab';
  import Tabs from 'react-bootstrap/Tabs';
  import '../../node_modules/bootstrap/dist/css/bootstrap.css';

  import LoadingSpinner from "../../src/app/LoadingSpinner";
  import { draftsList } from "../../src/app/draftsStore";
  import Editor from "../../src/components/Editor/Editor";
  
  const DraftPage = () => {
    const router = useRouter();
    //const { id } = router.query;
    const id = 33242342342;
    const [draft, setDraft] = useState(null);
    useEffect(() => {
      if (id === "new") {
        setDraft({
          content: "",
        });
      } else if (id) {
        getDraft(id).then((draft) => {
            setTimeout(() => {
                setDraft(draft);
            }, 1000);
        });
      }
    }, [id]);

    const getDraft = async (draftId) => {
       return draftsList.filter((draft) => draft.draftId === draftId)?.[0];
    };
  
    return (
      <div spacing={4}>
        <div>
          <div onClick={() => router.push("/")}>Go back to all drafts</div>
        </div>
      </div>
    );
  };
  
  export default DraftPage;
  