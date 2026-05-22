import { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Teams from "./pages/Teams";
import Competitions from "./pages/Competitions-home";
import CompetitionsInfo from "./pages/Competitions-info";
import Forums from "./pages/Forums";
import Support from "./pages/Support";
import SignUp from "./pages/SignUp";
import Testteam from "./pages/testteam";
import Account from "./pages/Account";
import Testlogin from "./pages/testlogins";
import TeamsCreate from "./pages/TeamsCreate";
import AdminCompetitionCreate from "./pages/AdminCompetitionCreate";
import CompetitionInfo from "./pages/CompetitionInfo";

function AppRoutes(): ReactElement {
    return (
        <Routes>
             <Route path="/competition/:competitionId" element={<CompetitionInfo />} />
            <Route path="/" element={<Home />} />
            <Route path="/Competitions" element={<Competitions />} />
            <Route path="/Forums" element={<Forums />} />
            <Route path="/Teams" element={<Teams />} />
            <Route path="/TeamsCreate" element={<TeamsCreate />} />
            <Route path="/CompetitionCreate" element={<AdminCompetitionCreate />} />
            <Route path="/CompetitionInfo/:competitionId" element={<CompetitionsInfo />} />
            <Route path="/Support" element={<Support />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/Testteam" element={<Testteam />} />
            <Route path="/Account" element={<Account />} />
            <Route path="/Testlogin" element={<Testlogin />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;