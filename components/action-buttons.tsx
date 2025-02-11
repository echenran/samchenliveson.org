import { Button } from "@/components/ui/button"

export function ActionButtons() {
  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4">
      <Button
        size="lg"
        className="bg-purple-600 hover:bg-purple-700"
        onClick={() => window.open("your-donation-link", "_blank")}
      >
        Make a Donation
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="border-purple-600 text-purple-600 hover:bg-purple-50"
        onClick={() => window.open("your-volunteer-link", "_blank")}
      >
        Volunteer as Grant Writer
      </Button>
    </div>
  )
}

