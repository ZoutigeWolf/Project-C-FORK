import { SetStateAction, useEffect, useState } from "react";
import { useAuthenticated } from "@/lib/hooks/useAuthenticated";
import { Link, useNavigate } from "react-router-dom";
import Settings from "../foundations/settings";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Textarea, TextareaHint } from "../ui/textarea";
import { Input } from "../ui/input";
import Header from "../foundations/header";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  API_BASE_URL,
  getBaseQueryRequest,
  putBaseMutateRequest,
} from "@/lib/api";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Toaster } from "../ui/toaster";
import { use } from "i18next";
import { toast } from "../ui/use-toast";
import { Ticket } from "@/services/Ticket";

function ViewTicket() {
  useAuthenticated();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(navigator.language);
  }, []);

  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [preview, setPreview] = useState<(string | ArrayBuffer)[]>([]);
  const [ticketInfo, setTicketInfo] = useState<any>(null);
  const ticketid = localStorage.getItem("currentticketID");
  const [showTicketInfo, setShowTicketInfo] = useState(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [solution, setSolution] = useState("");
  const [currentticket, setcurrenticket] = useState<Ticket | undefined>(undefined);
  const [reopen, setReopen] = useState("");

  useEffect(() => {
    CheckAccount();
  }, []);

  useEffect(() => {
    GetTicket();
  }, []);

  useEffect(() => {
    ShowTicket();
  })

  async function HandleCancel() {
    navigate(-1);
  }

  const CheckAccount = () => {
    const accountclass = localStorage.getItem("Class");
    console.log(accountclass);
    setIsClient((accountclass == "Client"));
  }


  const handleRemove = (indexToRemove: number) => {
    const updatedPreview = [...preview];
    updatedPreview.splice(indexToRemove, 1);
    setPreview(updatedPreview);
    console.log(preview);
  };

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    // const target = e.target as HTMLInputElement & {
    //   files: FileList;
    // }
    const fileList = e.target.files;

    if (fileList) {
      const allPreviews: (string | ArrayBuffer)[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];

        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (result) {
            allPreviews.push(result);
            // console.log(allPreviews);
            // You may want to set a state or perform other actions with 'result' here

            if (preview.length != null) {
              preview.forEach(function (item) {
                allPreviews.push(item);
              });
            }
            setPreview(allPreviews);
            console.log(preview);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  async function GetTicket() {
    let tick = await fetch(
      API_BASE_URL + "/api/tickets/" + ticketid,
      getBaseQueryRequest(),
    ).then((data) => data.json());
    setcurrenticket(tick);
    console.log(currentticket);
    // return currentticket;
  }

  async function ShowTicket() {
    if (currentticket) {
      setShowTicketInfo(true);
      setTicketInfo(currentticket);
    }
  }

  async function reopenTicket() {
    if (currentticket) {
      if (reopen.length != 0) {
        currentticket.notes = currentticket.notes ? [...currentticket.notes, reopen] : [reopen];
        currentticket.status = "Open"
        try {
          const response = await fetch(
            API_BASE_URL +
            "/api/tickets/" +
            currentticket.ticketId,
            putBaseMutateRequest(JSON.stringify(currentticket)),
          );

          if (!response.ok) {
            const errorResponse = await response.text(); // Capture response content
            throw new Error(
              `HTTP error! Status: ${response.status
              }. Error message: ${JSON.stringify(errorResponse)}`,
            );
          }
          alert("Ticket reopened");
          navigate(-1);
          // If needed, you can handle the response data here
        } catch (error) {
          console.error("Error during PUT request:", error);
        }
      }
      else {
        toast({
          variant: "destructive",
          title: "Error! Something went wrong.",
          description: "You need to enter a reason why you want to reopen the ticket",
        });
      }
    }
  }

  async function CloseTicket() {
    if (currentticket) {
      if (solution.length != 0) {
        currentticket.status = "Closed";
        currentticket.solution = solution;
        console.log(currentticket);
        try {
          const response = await fetch(
            API_BASE_URL +
            "/api/tickets/" +
            currentticket.ticketId,
            putBaseMutateRequest(JSON.stringify(currentticket)),
          );

          if (!response.ok) {
            const errorResponse = await response.text(); // Capture response content
            throw new Error(
              `HTTP error! Status: ${response.status
              }. Error message: ${JSON.stringify(errorResponse)}`,
            );
          }
          alert("Ticket closed");
          navigate(-1);
          // If needed, you can handle the response data here
        } catch (error) {
          console.error("Error during PUT request:", error);
        }
      }
      else {
        toast({
          variant: "destructive",
          title: "Error! Something went wrong.",
          description: "You need to enter a solution if you want to close the ticket",
        });
      }
    }
  }

  async function HandleSubmit() {
    // const currentticket = await GetTicket();
    if (currentticket) {
      // currentticket.notes = currentticket.notes ? [...currentticket.notes, notes] : [notes];
      // currentticket.files = currentticket.files ? [...currentticket.files, ...preview] : [preview];

      const ticket = {
        TicketId: currentticket.ticketId,
        Machine_Id: currentticket.machine_Id,
        Customer_Id: currentticket.customer_Id,
        Assigned_Id: currentticket.employee_Id,
        Title: currentticket.title,
        Priority: currentticket.priority,
        Status: currentticket.status,

        Problem: currentticket.problem,
        HaveTried: currentticket.haveTried,
        MustBeDoing: currentticket.mustBeDoing,
        Date_Created: currentticket.date_Created,

        Solution: currentticket.solution,
        PhoneNumber: currentticket.phoneNumber,
        Notes: currentticket.notes ? [...currentticket.notes, notes] : [notes],
        files: currentticket.files
          ? [...currentticket.files, ...preview]
          : [...preview],
      }
      try {
        const response = await fetch(
          API_BASE_URL + "/api/tickets/" + ticketid,
          putBaseMutateRequest(JSON.stringify(ticket)),
        );

        if (!response.ok) {
          const errorResponse = await response.text(); // Capture response content
          throw new Error(
            `HTTP error! Status: ${response.status
            }. Error message: ${JSON.stringify(errorResponse)}`,
          );
        }
        alert("Ticket updated");
        navigate(-1);
        // If needed, you can handle the response data here
      } catch (error) {
        console.error("Error during PUT request:", error);
      }
    };


  }



  return (
    <div className="px-24 text-left">
      <Settings></Settings>
      <div className="flex justify-center pb-16 pt-10">
        <Header></Header>
      </div>
      <div className="grid gap-12">
        <div className="">
          {/* <h1 className='text-4xl font-medium'>{t('editticket.header')}</h1> */}
          <h1 className="text-4xl font-medium">Your ticket</h1>
          <Label>View and edit ticket</Label>
          <Separator className="my-4" />
          <br />
          <Label></Label>
          {showTicketInfo && (
            <div>
              {/* Display your ticket information here */}
              <p>TicketID: {ticketInfo.ticketId}</p>
              <p>MachineID: {ticketInfo.machine_Id}</p>
              <p>Status: {ticketInfo.status}</p>
              {/* <p><b>{t('editticket.problem')}</b>{ticketInfo.problem}</p>
          <p><b>{t('editticket.mbd')}</b>{ticketInfo.mustBeDoing}</p>
          <p><b>{t('editticket.tried')}</b>{ticketInfo.haveTried}</p>
          <p><b>{t('editticket.notes3')}</b>{ticketInfo.notes}</p> */}
              <p>Problem: {ticketInfo.problem}</p>
              <p>Must be doing: {ticketInfo.mustBeDoing}</p>
              <p>What have you tried?: {ticketInfo.haveTried}</p>
              <p>Notes: {ticketInfo.notes}</p>
            </div>
          )}
        </div>
        {/* Hij checkt hieronder eerst of de ticket open is, anders kan je namelijk niks meer toevoegen, dan krijg je wel de optie om hem te heropenen */}
        {currentticket?.status === "Open" || currentticket?.status === "In Progress" ? <><div className="grid gap-2">
          {/* <h2 className='text-lg font-medium'>{t('editticket.notes')}</h2> */}
          {isClient ? null : <Button className="w-fit" variant="default">
            Change priority
          </Button>}
          <Dialog>
            <DialogTrigger asChild>
              {isClient ? null : <Button className="w-fit" variant="destructive">
                Close ticket
              </Button>}
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fill in solution</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                <h2 className="text-lg font-medium">Add solution</h2>

                {/* <Textarea placeholder={t('editticket.notes2')} onChange={(e: any) => setNotes(e.currentTarget.value)}></Textarea> */}
                {/* <p className='text-md text-grey-900 '>{t('editticket.description')}</p> */}
                <Textarea
                  placeholder="Fixed this and this"
                  onChange={(e: any) => setSolution(e.currentTarget.value)}
                ></Textarea>
                <TextareaHint>
                  Give us a detailed description on what was the solution of fixing the ticket
                </TextareaHint>
              </DialogDescription>
              <DialogFooter>
                <DialogClose>
                  <Button variant="ghost" onClick={() => navigate(`/view-ticket`)}>Cancel</Button>
                  <Button variant="secondary" onClick={CloseTicket}>Submit</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Toaster />
          <h2 className="text-lg font-medium">Add notes</h2>

          {/* <Textarea placeholder={t('editticket.notes2')} onChange={(e: any) => setNotes(e.currentTarget.value)}></Textarea> */}
          {/* <p className='text-md text-grey-900 '>{t('editticket.description')}</p> */}
          <Textarea
            placeholder="Still does not work because..."
            onChange={(e: any) => setNotes(e.currentTarget.value)}
          ></Textarea>
          <TextareaHint>
            Give us a detailed description on what you want to update the ticket
            with
          </TextareaHint>


        </div><div className="grid gap-2">
            <div className="">
              <Label>{t("ticket.files")}</Label>
              <Input
                className="w-2/6"
                name="image"
                multiple={true}
                onChange={handleFileUpload}
                accept="image/png, image/jpeg"
                id="picture"
                type="file" />
            </div>
            <div className="flex flex-wrap max-w-screen">
              {preview.map((previewItem, index) => (
                <div key={index} className="flex items-center m-4">
                  <img
                    src={previewItem as string}
                    alt={`Preview ${index}`}
                    style={{ maxWidth: "500px", maxHeight: "400px" }} />
                  <Button
                    variant={"destructive"}
                    onClick={() => handleRemove(index)}
                    className="ml-2"
                  >
                    {t("ticket.remove")}
                  </Button>{" "}
                  {/* Button to remove uploaded picture */}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Button variant="default" onClick={HandleSubmit}>
              Submit
            </Button>
            <Button variant="destructive" onClick={HandleCancel}>
              Go back
            </Button>
          </div></> :

          <div>
            <Dialog>
              <DialogTrigger asChild>
                {isClient ? null : <Button className="w-fit" variant="destructive">
                  Reopen ticket
                </Button>}
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reopen ticket</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <h2 className="text-lg font-medium">Why do you want to reopen the ticket?</h2>

                  {/* <Textarea placeholder={t('editticket.notes2')} onChange={(e: any) => setNotes(e.currentTarget.value)}></Textarea> */}
                  {/* <p className='text-md text-grey-900 '>{t('editticket.description')}</p> */}
                  <Textarea
                    placeholder="The error is not solved because..."
                    onChange={(e: any) => setReopen(e.currentTarget.value)}
                  ></Textarea>
                  <TextareaHint>
                    Give us a detailed description on why you want to reopen your ticket
                  </TextareaHint>
                </DialogDescription>
                <DialogFooter>
                  <DialogClose>
                    <Button variant="ghost" onClick={() => navigate(`/view-ticket`)}>Cancel</Button>
                    <Button variant="secondary" onClick={reopenTicket}>Submit</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Toaster />
            <Button variant="destructive" onClick={HandleCancel}>
              Go back
            </Button>
          </div>}


        {/* <Button variant='destructive'  onClick={HandleSubmit}>{t('editticket.submit')}</Button>
        <Button variant='destructive'  onClick={HandleCancel}>{t('editticket.cancel')}</Button> */}

      </div>
    </div>
  );
}

export default ViewTicket;
