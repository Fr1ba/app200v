import Case from './Case';
function CaseList(){
    let list = [{caseTitle:"Headphones", caseCategory:"Return", caseStatus: true},
        {caseTitle:"Telephone", caseCategory:"Return", caseStatus: false}];

    const caseList = list.map((caseItem) =>
            <Case caseTitle={caseItem.caseTitle} caseCategory={caseItem.caseCategory} caseStatus={caseItem.caseStatus}/>)


    return(
        <ul>
            {caseList}
        </ul>
    );

}
export default CaseList;