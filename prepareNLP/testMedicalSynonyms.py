# from owlready2 import *
# from owlready2.pymedtermino2.umls import *
# default_world.set_backend(filename = "pym.sqlite3")
# import_umls("umls-2022AB-metathesaurus-full.zip", terminologies = ["ICD10", "SNOMEDCT_US", "CUI"])
# default_world.save()

# from owlready2 import *
# default_world.set_backend(filename = "pym.sqlite3", exclusive = False)
# PYM = get_ontology("http://PYM/").load()
# SNOMEDCT_US = PYM["SNOMEDCT_US"]





# from owlready2 import *
# # Load the default world from the existing SQLite3 file
# default_world = World(filename="pym.sqlite3")
# # Load the ontology and SNOMEDCT_US terminology
# PYM = default_world.get_ontology("http://PYM/").load()
# SNOMEDCT_US = PYM["SNOMEDCT_US"]
# concept = SNOMEDCT_US[302509004]
# print(concept.synonyms)

#PubMed API

# from pymed import PubMed
# pubmed = PubMed(tool="MyTool", email="my@email.address")
# results = pubmed.query("heart attack", max_results=5)
# # Loop over the retrieved articles
# i = 0
# for article in results:
#     print('Sample no',i)
    

#     # Print the type of object we've found (can be either PubMedBookArticle or PubMedArticle)
#     print(type(article))

#     # Print a JSON representation of the object
#     print(article.toJSON())
#     i+=1


#BioMedLM GPT


# import torch

# from transformers import GPT2LMHeadModel, GPT2Tokenizer

# device = torch.device("cuda")

# tokenizer = GPT2Tokenizer.from_pretrained("stanford-crfm/BioMedLM")

# model = GPT2LMHeadModel.from_pretrained("stanford-crfm/BioMedLM").to(device)

# input_ids = tokenizer.encode(
#     "Photosynthesis is ", return_tensors="pt"
# ).to(device)

# sample_output = model.generate(input_ids, do_sample=True, max_length=50, top_k=50)

# print("Output:\n" + 100 * "-")
# print(tokenizer.decode(sample_output[0], skip_special_tokens=True))
















