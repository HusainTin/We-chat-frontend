import { NextPage } from 'next'
import { Metadata as NextMetaData} from "next";
interface Props {
    title:any;
    desc:any;
}

const MetaData: NextPage<Props> = ({title, desc}) => {
const metadata: NextMetaData = {
    title: title,
    description: desc,
    };
  return (
  <>
  
  </>)
}

export default MetaData